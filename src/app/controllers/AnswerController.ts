import AnswerBuilder from '@builders/AnswerBuilder';
import { recognizerIA } from '@config/recognizer.ia.config';
import Answer from '@entities/Answer';
import Member from '@entities/Member';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { strictEquals } from '@helpers/stringHelpers';
import ControllerProtocol from '@interfaces/controller.protocol';
import { Request, Response } from 'express';
import sharp = require('sharp');
import prisma from '@config/prisma.client';

export default class AnswerController implements ControllerProtocol {
  private answerBuilder = new AnswerBuilder();

  public async store(request: Request, response: Response): Promise<void> {
    const { examId } = request.params;
    const { file } = request;
    console.log(file);

    if (!file) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    const imgCompress = await sharp({
      create: {
        width: 48,
        height: 48,
        channels: 4,
        background: {
          r: 255, g: 0, b: 0, alpha: 0.5,
        },
      },
    })
      .jpeg()
      .toBuffer();

    console.log(imgCompress.toString('base64'));
    const { data: { student_registration, ...template } } = await recognizerIA.post('', { image: imgCompress.toString('base64') });

    const member = await Member.findOne({ externalId: student_registration });

    if (!member) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    this.answerBuilder.reset();
    this.answerBuilder.template = template ?? '';
    this.answerBuilder.templatePicture = imgCompress.toString('base64') ?? '';
    this.answerBuilder.membersId = member.id ?? '';
    this.answerBuilder.exameId = examId ?? '';

    const newAnswer = this.answerBuilder.build();
    const savedAnswer = await newAnswer?.save();

    if (!savedAnswer) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
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
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    response.status(201).json({
      success: 'Responstas encontradas com sucesso!',
      answers: storedAnswers,
    });
  }
}
