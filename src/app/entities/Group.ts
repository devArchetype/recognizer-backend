import prisma from '@config/prisma.client';
import { Groups } from '@prisma/client';
import { GroupDTO } from 'src/@types/dto';

export default class Group {
  constructor(
    private name: string,
    private userId: string,
    private id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const storedGroup = await prisma.groups.create({
          data: {
            name: this.name,
            userId: this.userId,
          },
        });

        this.id = storedGroup.id;
      } else {
        await prisma.groups.update({
          where: {
            id: this.id,
          },
          data: {
            name: this.name,
          },
        });
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  private validate(): boolean {
    return !!(this.name && this.userId);
  }

  public static async findOne(group: GroupDTO): Promise<Groups | null> {
    return prisma.groups.findFirst({
      where: {
        ...group,
      },
    });
  }

  public static async findMany(group: GroupDTO): Promise<Groups[] | null> {
    return prisma.groups.findMany({
      where: {
        ...group,
      },
    });
  }

  public static async destroy(group: GroupDTO): Promise<Groups | null> {
    return prisma.groups.delete({
      where: {
        ...group,
      },
    });
  }
}
