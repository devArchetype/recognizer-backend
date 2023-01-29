import prisma from '@config/prisma.client';
import { Request, Response } from 'express';
import Exam from '@entities/Exam';
import ControllerProtocol from '@interfaces/controller.protocol';
import ExamBuilder from '@builders/ExamBuilder';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { Prisma } from '.prisma/client';
import Group from '@entities/Group';

export default class ExamController implements ControllerProtocol {
  private examBuilder = new ExamBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const {
      name, date, description, updatedAnsers, groupId,
    } = req.body;

    const group = await Group.findOne({ id: groupId });
    if (!group) {
      throw new BadRequestError('O Grupo dessa Prova não existe');
    }

    this.examBuilder.name = name ?? '';
    this.examBuilder.description = description ?? null;
    this.examBuilder.examDate = date ?? null;
    this.examBuilder.template = updatedAnsers ? JSON.stringify(updatedAnsers) : '';
    this.examBuilder.groupId = group.id ?? '';

    const exam = this.examBuilder.build();
    const saveEcam = await exam?.save() ?? false;

    if (!saveEcam) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      success: 'Prova criada!',
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

  }

  public async show(req: Request, res: Response): Promise<void> {
    const { id } = req.user;
    const { groupId } = req.params;

    const group = await Group.findOne({ userId: id, id: groupId });
    if (!group) {
      throw new BadRequestError(
        'Grupo inválido!',
      );
    }

    const storedExms = await Exam.findMany({ groupId });
    if (!storedExms) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    res.status(201).json({
      success: 'Provas encontrados com sucesso!',
      exams: storedExms,
    });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.body;

    try {
      const deletedExam = await Exam.destroy({ id });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2025'
      ) {
        throw new NotFoundError('A Prova não existe');
      }

      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    res.status(201).json({
      success: 'Prova deletado com sucesso!',
    });
  }
}
