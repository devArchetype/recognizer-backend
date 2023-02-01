import AnswerBuilder from '@builders/AnswerBuilder';
import Answer from '@entities/Answer';
import { BadRequestError, NotFoundError } from '@erros/api-erros';
import { strictEquals } from '@helpers/stringHelpers';
import ControllerProtocol from '@interfaces/controller.protocol';
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

  public async index(request: Request, response: Response): Promise<void> {
    const { answerId } = request.params;

    const storedAnswer = await Answer.findOne({ id: answerId });
    console.log(storedAnswer);
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
