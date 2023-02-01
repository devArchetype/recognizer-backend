import AnswerBuilder from '@builders/AnswerBuilder';
import Answer from '@entities/Answer';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { strictEquals } from '@helpers/stringHelpers';
import ControllerProtocol from '@interfaces/controller.protocol';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export default class AnswerController implements ControllerProtocol {
  private answerBuilder = new AnswerBuilder();

  public async store(request: Request, response: Response): Promise<void> {
    const {
      template, templatePicture, membersId, exameId,
    } = request.body;
    const { id } = request.user;

    this.answerBuilder.reset();
    this.answerBuilder.template = template ?? '';
    this.answerBuilder.templatePicture = templatePicture ?? '';
    this.answerBuilder.membersId = membersId ?? '';
    this.answerBuilder.exameId = exameId ?? '';

    const storedAnswer = await Answer.findOne({
      template,
      templatePicture,
      membersId,
      exameId,
    });
    if (storedAnswer) {
      const equalNames = strictEquals(storedAnswer.template, template);
      if (equalNames) {
        throw new BadRequestError('erro');
      }
    }

    const newAnswer = this.answerBuilder.build();
    const savedAnswer = await newAnswer?.save();
    if (!savedAnswer) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Answer criada com sucesso!',
    });
  }

  public async update(request: Request, response: Response): Promise<void> {
    const {
      id, template, templatePicture, membersId, exameId,
    } = request.body;

    this.answerBuilder.reset();
    this.answerBuilder.template = template;
    this.answerBuilder.templatePicture = templatePicture;
    this.answerBuilder.membersId = membersId;
    this.answerBuilder.exameId = exameId;
    this.answerBuilder.id = id;

    const answer = this.answerBuilder.build();
    const updatedAnswers = await answer?.save();

    if (!updatedAnswers) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    response.status(201).json({
      success: 'Grupo atualizado com sucesso!',
    });
  }

  public async index(request: Request, response: Response): Promise<void> {
    const {
      id, template, templatePicture, membersId, exameId,
    } = request.body;
    const userId = request.user.id;

    const storedAnswer = await Answer.findOne({
      id, template, templatePicture, membersId, exameId,
    });
    if (!storedAnswer) {
      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Grupo encontrado com sucesso!',
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
      success: 'Answers encontradas com sucesso!',
      answers: storedAnswers,
    });
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.body;

    try {
      const deletedAnswers = await Answer.destroy({ id });
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2025'
      ) {
        throw new NotFoundError('A resposta não existe');
      }

      throw new BadRequestError(
        'Oops, Algo de errado aconteceu, tente novamente mais tarde!',
      );
    }

    response.status(201).json({
      success: 'Resposta deletada com sucesso!',
    });
  }
}
