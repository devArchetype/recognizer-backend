import AnswerBuilder from '@builders/AnswerBuilder';
import { recognizerIA } from '@config/recognizer.ia.config';
import Answer from '@entities/Answer';
import Member from '@entities/Member';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import ControllerProtocol from '@interfaces/controller.protocol';
import { Request, Response } from 'express';
import sharp = require('sharp');
import prisma from '@config/prisma.client';

export default class AnswerController implements ControllerProtocol {
  private answerBuilder = new AnswerBuilder();

  public async store(request: Request, response: Response): Promise<void> {
    const { examId } = request.params;
    const { file } = request;

    if (!file) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!1',
      );
    }

    const imgCompress = await sharp(file.buffer)
      .jpeg({
        quality: 50,
      })
      .toBuffer();

    const { data: { student_registration, ...template } } = await recognizerIA.post('/recognizer', { image: imgCompress.toString('base64') });

    const member = await Member.findOne({ externalId: student_registration });
    if (!member) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!2',
      );
    }

    const answer = await Answer.findOne({ examsId: examId, membersId: member.id });
    if (answer) {
      const memberHasExam = await prisma.membersHasExams.findFirst({ where: { memberId: member.id, examsId: examId } });
      if (memberHasExam) await prisma.membersHasExams.delete({ where: { id: memberHasExam.id } });
      await Answer.destroy({ id: answer.id });
    }

    this.answerBuilder.reset();
    this.answerBuilder.template = JSON.stringify(template) ?? '';
    this.answerBuilder.templatePicture = String(imgCompress.toString('base64')) ?? '';
    this.answerBuilder.membersId = member.id ?? '';
    this.answerBuilder.exameId = examId ?? '';

    const newAnswer = this.answerBuilder.build();
    const savedAnswer = await newAnswer?.save();

    if (!savedAnswer) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!3',
      );
    }

    await prisma.membersHasExams.create({
      data: {
        memberId: member.id,
        examsId: examId,
      },
    });

    response.status(201).json({
      success: 'Gabarito corrigido com sucesso!',
    });
  }

  public async index(request: Request, response: Response): Promise<void> {
    const { answerId } = request.params;

    const storedAnswer = await Answer.findOne({ id: answerId });
    if (!storedAnswer) {
      throw new NotFoundError(
        'Responsta não existe',
      );
    }

    response.status(201).json({
      success: 'Responsta encontrada com sucesso!',
      answer: storedAnswer,
    });
  }

  public async show(request: Request, response: Response): Promise<void> {
    const { id } = request.user;

    const storedAnswers = await Answer.findMany({ id });
    if (!storedAnswers) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!2');
    }

    response.status(201).json({
      success: 'Responstas encontradas com sucesso!',
      answers: storedAnswers,
    });
  }
}
