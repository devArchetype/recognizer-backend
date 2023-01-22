import { Members } from '@prisma/client';
import prisma from '@config/prisma.client';
import { MemberDTO } from 'src/@types/dto';

export default class Member {
  constructor(
    private name: string,
    private externalId: string | null,
    private id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const memberBD = await prisma.members.create({
          data: {
            name: this.name,
            externalId: this.externalId,
          },
        });

        this.id = memberBD.id;
      } else {
        await prisma.members.update({
          where: {
            id: this.id,
          },
          data: {
            name: this.name,
            externalId: this.externalId,
          },
        });
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  private validate(): boolean {
    if (this.name) return true;
    return false;
  }

  public static async findMany(member: MemberDTO): Promise<Members[] | null> {
    return prisma.members.findMany({
      where: {
        ...member,
      },
    });
  }

  public static async destroy(member: MemberDTO): Promise<Members | null> {
    return prisma.members.delete({
      where: {
        ...member,
      },
    });
  }
}
