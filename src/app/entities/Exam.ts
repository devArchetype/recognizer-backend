import { Exams } from '@prisma/client';
import prisma from '@config/prisma.client';
import { ExamDTO } from 'src/@types/dto';

export default class Exam {
  constructor(
    private name: string,
    private description: string | null,
    private examDate: Date | null,
    private template: string,
    private groupId: string,
    private id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const examBD = await prisma.exams.create({
          data: {
            name: this.name,
            description: this.description,
            examDate: this.examDate,
            template: this.template,
            groupId: this.groupId,
          },
        });

        this.id = examBD.id;
      } else {
        await prisma.exams.update({
          where: {
            id: this.id,
          },
          data: {
            name: this.name,
            description: this.description,
            examDate: this.examDate,
            template: this.template,
            groupId: this.groupId,
          },
        });
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  private validate(): boolean {
    if (this.name && this.template && this.groupId) return true;
    return false;
  }

  public static async findOne(exam: ExamDTO): Promise<Exams | null> {
    return prisma.exams.findFirst({
      where: {
        ...exam,
      },
    });
  }

  public static async destroy(group: ExamDTO): Promise<Exams | null> {
    return prisma.exams.delete({
      where: {
        ...group,
      },
    });
  }
}
