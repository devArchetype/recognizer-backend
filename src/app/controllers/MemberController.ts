import { BadRequestError, UnauthorizedError } from '@erros/api-erros';
import Member from '@entities/Member';
import { Request, Response } from 'express';

import MemberBuilder from '@builders/MemberBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';

export default class MemberController implements ControllerProtocol {
  private memberBuilder = new MemberBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, externalId } = req.body;

    this.memberBuilder.reset();
    this.memberBuilder.name = name ?? '';
    this.memberBuilder.externalId = externalId ?? null;

    const newMember = this.memberBuilder.build();
    const saveMember = await newMember?.save() ?? false;

    if (!saveMember) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }
    res.status(201).json({
      sucess: 'Membro cadastrado com sucesso!',
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

  }

  public async delete(req: Request, res: Response): Promise<void> {
    const memberId = req.params.id ?? null;
    const member = await Member.findMany({ id: memberId });
    if (!member || member.length <= 0) {
      throw new BadRequestError('Esse membro não existe!');
    }

    const deletedMember = await Member.destroy({ id: memberId });
    if (!deletedMember) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      sucess: 'Membro deletado com sucesso!',
    });
  }
}
