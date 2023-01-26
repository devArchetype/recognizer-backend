import { Users } from '@prisma/client';
import prisma from '@config/prisma.client';
import { UserDTO } from 'src/@types/dto';

export default class User {
  constructor(
    private name: string,
    private email: string,
    private password: string,
    private avatar: string | null,
    private id?: string,
  ) {}

  public async save(): Promise<boolean> {
    if (!this.validate()) return false;

    try {
      if (!this.id) {
        const userBD = await prisma.users.create({
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
            avatar: this.avatar,
          },
        });

        this.id = userBD.id;
      } else {
        await prisma.users.update({
          where: {
            id: this.id,
          },
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
            avatar: this.avatar,
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

  public static async destroy(user: UserDTO): Promise<Users | null> {
    return prisma.users.delete({
      where: {
        ...user,
      },
    });
  }
}
