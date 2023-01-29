import { Members, Users } from '@prisma/client';
import prisma from '@config/prisma.client';
import { MemberDTO } from 'src/@types/dto';

export default class Member {
  constructor(
    private name: string,
    private externalId: string | null,
    private id?: string,
  ) {}

  public async save(): Promise<Members | null> {
    if (!this.validate()) return null;

    try {
      if (!this.id) {
        const memberBD = await prisma.members.create({
          data: {
            name: this.name,
            externalId: this.externalId,
          },
        });

        this.id = memberBD.id;

        return memberBD;
      }
      return await prisma.members.update({
        where: {
          id: this.id,
        },
        data: {
          name: this.name,
          externalId: this.externalId,
        },
      });
    } catch (err) {
      return null;
    }
  }

  private validate(): boolean {
    if (this.name) return true;
    return false;
  }

  public static async findOne(member: MemberDTO): Promise<Members | null> {
    return prisma.members.findFirst({
      where: {
        ...member,
      },
    });
  }

  public static async findMany(ids: string[]): Promise<Members[] | null> {
    return prisma.members.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        _count: true,
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
