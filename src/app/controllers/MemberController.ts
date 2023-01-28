import { BadRequestError } from '@erros/api-erros';
import Member from '@entities/Member';
import { Request, Response } from 'express';

import MemberBuilder from '@builders/MemberBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import Group from '@entities/Group';
import prisma from '@config/prisma.client';
import { Members } from '@prisma/client';

export default class MemberController implements ControllerProtocol {
  private memberBuilder = new MemberBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, externalId } = req.body;

    this.memberBuilder.reset();
    this.memberBuilder.name = name ?? '';
    this.memberBuilder.externalId = externalId ?? null;

    const newMember = this.memberBuilder.build();
    const saveMember = await newMember?.save() ?? false;

    if (!saveMember) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }
    res.status(201).json({
      sucess: 'Membro cadastrado com sucesso!',
    });
  }

  public async show(req: Request, res: Response): Promise<void> {
    const groupId = req.params.groupId ?? null;
    const group = await Group.findOne({ id: groupId, userId: req.user.id });
    if (!group) {
      throw new BadRequestError('Grupo inexistente!');
    }

    const groupsHasMembers = await prisma.groupsHasMembers.findMany({
      where: {
        groupId,
      },
    });

    let members: Members[] | null = [];
    if (groupsHasMembers && groupsHasMembers.length > 0) {
      const ids = groupsHasMembers.map(({ memberId }) => memberId);
      members = await Member.findMany(ids);
    }

    res.status(201).json({
      sucess: `Selecione os Membros presentes no grupo ${group.name}`,
      members: members ?? [],
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

  }

  public async delete(req: Request, res: Response): Promise<void> {
    const memberId = req.params.id ?? null;
    const member = await Member.findOne({ id: memberId });
    if (!member) {
      throw new BadRequestError('Esse membro não existe!');
    }

    const deletedMember = await Member.destroy({ id: memberId });
    if (!deletedMember) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      sucess: 'Membro deletado com sucesso!',
    });
  }
}
