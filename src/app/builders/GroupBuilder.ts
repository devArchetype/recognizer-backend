import Group from '@entities/Group';
import { BadRequestError } from '@erros/api-erros';
import Builder from '@interfaces/builder.protocol';
import validator from 'validator';

export default class GroupBuilder implements Builder {
  constructor(
    private _name: string = '',
    private _userId: string = '',
    private _id: string = '',
  ) {}

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    if (validator.isEmpty(name)) {
      throw new BadRequestError('Nome inválido');
    }

    this._name = name;
  }

  public get userId(): string {
    return this._name;
  }

  public set userId(userId: string) {
    if (validator.isEmpty(userId)) {
      throw new BadRequestError('Id de usuário vazio');
    }

    this._userId = userId;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public reset(): void {
    this._name = '';
    this._userId = '';
    this._id = '';
  }

  public build(): Group | null {
    if (!this.validate()) return null;

    if (this._id) {
      return new Group(
        this._name,
        this._userId,
        this._id,
      );
    }

    return new Group(
      this._name,
      this._userId,
    );
  }

  private validate(): boolean {
    return !!(this.name && this.userId);
  }
}
