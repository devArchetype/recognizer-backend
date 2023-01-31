import prisma from '@config/prisma.client';
import { Answers } from '@prisma/client';
import { AnswerDTO } from 'src/@types/dto';

export default class Answer {
  constructor(
    private id: string,
    private template: string,
    private description?: string | null,
    private templatePicture?: string,
    private membersId?: string,
    private exameId?: string
  ) {}
 
  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const storedAnswers = await prisma.answers.create({
          data: {
            template: this.template,
            description: this.description,
            templatePicture: this.templatePicture,
            membersId: this.membersId,
            exameId: this.exameId

          },
        });

        this.id = storedAnswers.id;
      } else {
        await prisma.groups.update({
          where: {
            id: this.id,
          },
          data: {
            template: this.template,
            description: this.description,
            templatePicture: this.templatePicture,
            membersId: this.membersId,
            exameId: this.exameId
          },
        });
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  private validate(): boolean {
    return !!(this.id && this.template && this.templatePicture);
  }

  public static async findOne(answer: AnswerDTO): Promise<Answers | null> {
    return prisma.answers.findFirst({
      where: {
        ...answer,
      },
    });
  }

  public static async findMany(answer: AnswerDTO): Promise<Answers[] | null> {
    return prisma.answers.findMany({
      where: {
        ...answer,
      },
    });
  }

  public static async destroy(answer: AnswerDTO): Promise<Answers | null> {
    return prisma.answers.delete({
      where: {
        ...answer,
      },
    });
  }
}
