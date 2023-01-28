import GroupBuilder from '@builders/GroupBuilder';
import Group from '@entities/Group';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { strictEquals } from '@helpers/stringHelpers';
import ControllerProtocol from '@interfaces/controller.protocol';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export default class GroupController implements ControllerProtocol {
  private groupBuilder = new GroupBuilder();

  public async store(request: Request, response: Response): Promise<void> {
    const { name } = request.body;
    const { id } = request.user

    this.groupBuilder.reset();
    this.groupBuilder.name = name ?? '';
    this.groupBuilder.userId = id ?? '';

    const storedGroup = await Group.findOne({ name, userId: id });
    if (storedGroup) {
      const equalNames = strictEquals(storedGroup.name, name);
      if (equalNames) {
        throw new BadRequestError('O grupo já existe');
      }
    }

    const newGroup = this.groupBuilder.build();
    const savedGroup = await newGroup?.save();
    if (!savedGroup) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Grupo criado com sucesso!',
    });
  }

  public async update(request: Request, response: Response): Promise<void> {
    const { id, name } = request.body;
    const userId = request.user.id

    this.groupBuilder.reset();
    this.groupBuilder.name = name;
    this.groupBuilder.userId = userId;
    this.groupBuilder.id = id;

    const group = this.groupBuilder.build();
    const updatedGroup = await group?.save();

    if (!updatedGroup) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    response.status(201).json({
      success: 'Grupo atualizado com sucesso!',
    });
  }

  public async index(request: Request, response: Response): Promise<void> {
    const { id } = request.body;
    const userId = request.user.id

    const storedGroup = await Group.findOne({ id, userId });
    if (!storedGroup) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Grupo encontrado com sucesso!',
      group: storedGroup,
    });
  }

  public async show(request: Request, response: Response): Promise<void> {
    const { id } = request.user

    const storedGroups = await Group.findMany({ userId: id });
    if (!storedGroups) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!'
      );
    }

    response.status(201).json({
      success: 'Grupos encontrados com sucesso!',
      groups: storedGroups,
    });
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.body;

    try {
      const deletedGroup = await Group.destroy({ id});

    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2025'
      ) {
        throw new NotFoundError('O grupo não existe');
      }

      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Grupo deletado com sucesso!',
    });
  }
}
