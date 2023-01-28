import prisma from '@config/prisma.client';
import { Request, Response } from 'express';
import Exam from '@entities/Exam';
import ControllerProtocol from '@interfaces/controller.protocol';
import ExamBuilder from '@builders/ExamBuilder';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { Prisma } from '.prisma/client';

export default class ExamController implements ControllerProtocol {
  private examBuilder = new ExamBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const {
      name, description, examDate, template, groupId,
    } = req.body;

    this.examBuilder.name = name ?? '';
    this.examBuilder.description = description ?? null;
    this.examBuilder.examDate = examDate ?? null;
    this.examBuilder.template = template ?? '';
    this.examBuilder.groupId = groupId ?? '';

    const exam = this.examBuilder.build();
    const saveEcam = await exam?.save() ?? false;

    if (!saveEcam) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      sucess: 'Prova criada!',
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

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
