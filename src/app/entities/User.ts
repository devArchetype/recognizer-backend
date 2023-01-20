import { Users } from '@prisma/client';
import prisma from '@config/prisma.client';
import { UserDTO } from 'src/@types/types.dto';

export default class User implements UserDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public avatar: string | null,
    public id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const userBD = await prisma.users.create({
          data: {
            ...this,
          },
        });

        this.id = userBD.id;
      } else {
        await prisma.users.update({
          where: {
            ...this,
          },
          data: {
            ...this,
          },
        });
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  private validate(): boolean {
    if (this.name && this.email && this.password) return true;
    return false;
  }

  public static async findOne(user: UserDTO): Promise<Users | null> {
    return prisma.users.findFirst({
      where: {
        ...user,
      },
    });
  }
}
