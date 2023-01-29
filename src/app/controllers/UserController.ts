import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';
import { BadRequestError } from '@erros/api-erros';
import jwtConfig from '@config/jwt.config';
import prisma from '@config/prisma.client';
import transporter from '@config/nodemailer.config';
import { JwtPayload } from 'src/@types/jwt.payload';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    this.userBuilder.reset();
    this.userBuilder.name = name ?? '';
    this.userBuilder.email = email ?? '';
    this.userBuilder.password = password ? await bcrypt.hash(password, 10) : '';

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError('Usuário Já Existe');
    }

    const newUser = this.userBuilder.build();
    const saveUser = await newUser?.save() ?? false;

    if (!saveUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Usuário cadastrado com sucesso!',
    });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const {
      name, email, password, avatar,
    } = req.body;

    this.userBuilder.reset();
    this.userBuilder.id = req.user.id;
    this.userBuilder.name = name ?? req.user.name;
    this.userBuilder.email = email ?? req.user.email;
    this.userBuilder.password = password ?? req.user.password;
    this.userBuilder.avatar = avatar ?? req.user.avatar;

    const user = this.userBuilder.build();
    const updatedUser = await user?.save() ?? false;

    if (!updatedUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Dados atualizados!',
      user: {
        name: this.userBuilder.name,
        email: this.userBuilder.email,
        avatar: this.userBuilder.avatar,
      },
    });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.user;
    const deletedUser = await User.destroy({ id });

    if (!deletedUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Usuário deletado com sucesso!',
    });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const {
      email, password,
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const token = jwt.sign({ id: user.id }, jwtConfig.secret, jwtConfig.signOptions);
    const { password: _, ...loggedUser } = user;

    res.status(200).json({
      user: loggedUser,
      token,
    });
  }

  public async statistics(req: Request, res: Response): Promise<void> {
    const groupsBD = await prisma.groups.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        GroupsHasMembers: true,
      },
    });

    if (!groupsBD || groupsBD.length <= 0) {
      res.status(201).json({
        groups: 0,
        members: 0,
      });

      return;
    }

    let members = 0;
    for (const group of groupsBD) {
      members += group.GroupsHasMembers.length;
    }

    res.status(201).json({
      groups: groupsBD.length,
      members,
    });
  }

  public async verificationCode(req: Request, res: Response): Promise<void> {
    const code = jwt.sign({ email: req.user.email }, jwtConfig.secret, { expiresIn: '10m' });

    await transporter.sendMail({
      from: 'Recognizer <' + `${process.env.EMAIL}>`,
      to: req.user.email,
      subject: 'Código de Verificação',
      html: `<h1>Olá, ${req.user.name}!</h1> <p>Aqui está seu código de verificação: ${code}</p>`,
      text: `Olá, ${req.user.name}!\nAqui está seu código de verificação: ${code}`,
    });

    res.status(201).json({
      success: 'Preecha o respectivo campo com o código de verificação enviado ao seu email',
    });
  }

  public async verificationCodeLoggedOut(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const code = jwt.sign({ email }, jwtConfig.secret, { expiresIn: '10m' });

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Essa conta não existe!');
    }

    await transporter.sendMail({
      from: 'Recognizer <' + `${process.env.EMAIL}>`,
      to: email,
      subject: 'Código de Verificação',
      html: `<h1>Olá, ${user.name}!</h1> <p>Aqui está seu código de verificação: ${code}</p>`,
      text: `Olá, ${user.name}!\nAqui está seu código de verificação: ${code}`,
    });

    res.status(201).json({
      success: 'Cóndigo enviado!',
    });
  }

  public async recoveryPassword(req: Request, res: Response): Promise<void> {
    const {
      code, password,
    } = req.body;

    const { email } = jwt.verify(code, jwtConfig.secret, (err: unknown, decoded: unknown) => {
      if (err) {
        throw new BadRequestError('Codigo de verificação inválido!');
      } else {
        return decoded;
      }
    }) as unknown as JwtPayload;

    if (email !== req.user.email) {
      throw new BadRequestError('Codigo de verificação inválido!');
    }

    this.userBuilder.reset();
    this.userBuilder.id = req.user.id;
    this.userBuilder.name = req.user.name;
    this.userBuilder.email = req.user.email;
    this.userBuilder.password = await bcrypt.hash(password, 10) ?? req.user.password;
    this.userBuilder.avatar = req.user.avatar;

    const user = this.userBuilder.build();
    const updatedUser = await user?.save() ?? false;

    if (!updatedUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Senha atualizada!',
    });
  }

  public async recoveryPasswordLoggedOut(req: Request, res: Response): Promise<void> {
    const {
      code, password,
    } = req.body;

    const { email } = jwt.verify(code, jwtConfig.secret, (err: unknown, decoded: unknown) => {
      if (err) {
        throw new BadRequestError('Codigo de verificação inválido!');
      } else {
        return decoded;
      }
    }) as unknown as JwtPayload;

    const userRecovery = await User.findOne({ email });
    if (!userRecovery) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    if (email !== userRecovery.email) {
      throw new BadRequestError('Codigo de verificação inválido!');
    }

    this.userBuilder.reset();
    this.userBuilder.id = userRecovery.id;
    this.userBuilder.name = userRecovery.name;
    this.userBuilder.email = userRecovery.email;
    this.userBuilder.password = await bcrypt.hash(password, 10) ?? userRecovery.password;
    this.userBuilder.avatar = userRecovery.avatar ?? '';

    const user = this.userBuilder.build();
    const updatedUser = await user?.save() ?? false;

    if (!updatedUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Senha atualizada!',
    });
  }
}
