import prisma from '@config/prisma.client';
import { Request, Response } from 'express';
import Exam from '@entities/Exam';
import Member from '@entities/Member';
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
  public async members(req: Request, res: Response): Promise<void> {
    const { examsId } = req.params;
    
    const members = await prisma.membersHasExams.findMany({
      where: {
        examsId,
      }
    });
   

    if (!members) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    const membersName = await prisma.members.findMany({
      where: {
        id: {
          in: members.map((member) => member.memberId),
        },
      },
    });

    if (!membersName) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    res.status(201).json({
      success: 'Alunos encontrados com sucesso!',
      members: membersName,
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

  }

  public async index(request: Request, response: Response): Promise<void> {
    //Get the exam id from the request
    const { examId } = request.params;
    
   //Get exam based on id
    const exam = await Exam.findOne( examId );
   
    if (!exam) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Exame encontrado com sucesso!',
      exam: exam,
    });
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
    const { examId } = req.params;

    try {
      const deletedExam = await Exam.destroy( { id: examId } );
      res.status(201).json({
        success: 'Prova deletado com sucesso!',
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2025'
      ) {
        throw new NotFoundError('A Prova não existe');
      }
        
      res.status(500).json({
        error: 'Código : '+examId,
        details: error?.toString()
      } as { error: string; details: string });
    }

  
  }
}
