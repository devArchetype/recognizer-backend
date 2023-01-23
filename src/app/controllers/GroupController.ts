import GroupBuilder from "@builders/GroupBuilder";
import Group from "@entities/Group";
import { BadRequestError, NotFoundError } from "@erros/api-erros";
import ControllerProtocol from "@interfaces/controller.protocol";
import { Prisma } from "@prisma/client";
import { Request, Response } from 'express';
import { strictEquals } from "src/helpers/stringHelpers";


export default class GroupController implements ControllerProtocol {
  private groupBuilder = new GroupBuilder();

  public async store(request: Request, response: Response): Promise<void> {
    const { name, userId } = request.body;

    this.groupBuilder.reset();
    this.groupBuilder.name = name ?? '';
    this.groupBuilder.userId = userId ?? '';

    const storedGroup = await Group.findOne({ name, userId });
    if (storedGroup) {
      const equalNames = strictEquals(storedGroup.name, name)
      if (equalNames) {
        throw new BadRequestError('O grupo já existe');
      }
    }

    const newGroup = this.groupBuilder.build();
    const savedGroup = await newGroup?.save()
    if (!savedGroup) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!'
      );
    }

    response.status(201).json({
      success: 'Grupo criado com sucesso!',
    });
  }

  public async update(request: Request, response: Response): Promise<void> {
    const { id, name } = request.body

    response.status(201).json({
      success: 'Grupo atualizado com sucesso!',
    });
  }

  public async index(request: Request, response: Response): Promise<void> {
    const { id } = request.body;

    const storedGroup = await Group.findOne({ id });
    if (!storedGroup) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!'
      );
    }

    response.status(201).json({
      success: 'Grupo encontrado com sucesso!',
      group: storedGroup
    });
  }

  public async show(request: Request, response: Response): Promise<void> {
    const { userId } = request.body;

    const storedGroups = await Group.findMany({ userId });
    if (!storedGroups) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!'
      );
    }

    response.status(201).json({
      success: 'Grupos encontrados com sucesso!',
      groups: storedGroups
    });
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.body;

    try {
      const deletedGroup = await Group.destroy({ id });

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('O grupo não existe');
      } 
      
      throw new BadRequestError(
          'Oops, Algo de errado aconteceu, tente novamente mais tarde!'
      );
    }

    response.status(201).json({
      success: 'Grupo deletado com sucesso!',
    });
  }
}