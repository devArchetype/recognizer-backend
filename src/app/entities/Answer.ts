import prisma from '@config/prisma.client';
import { Answers } from '@prisma/client';
import { AnswerDTO } from 'src/@types/dto';

export default class Answer {
  constructor(
    private template: string,
    private templatePicture: string,
    private membersId: string,
    private examsId: string,
    private id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const storedAnswers = await prisma.answers.create({
          data: {
            template: this.template,
            templatePicture: this.templatePicture,
            membersId: this.membersId,
            examsId: this.examsId,
          },
        });
        this.id = storedAnswers.id;
      } else {
        await prisma.answers.update({
          where: {
            id: this.id,
          },
          data: {
            template: this.template,
            templatePicture: this.templatePicture,
            membersId: this.membersId,
            examsId: this.examsId,
          },
        });
      }
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  private validate(): boolean {
    if (this.template && this.templatePicture) return true;
    return false;
  }

  public static async findOne(answer: AnswerDTO): Promise<Answers | null> {
    return prisma.answers.findFirst({
      where: {
        ...answer,
      },
      include: {
        Exams: true,
        Members: true,
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
