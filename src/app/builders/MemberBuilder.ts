import validator from 'validator';
import Member from '../entities/Member';
import { BadRequestError } from '../../errors/api-erros';
import Builder from '../interfaces/builder.protocol';

export default class MemberBuilder implements Builder {
  constructor(
    private _name: string = '',
    private _externalId: string | null = null,
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

  public get externalId(): string | null {
    return this._externalId;
  }

  public set externalId(externalId: string | null) {
    this._externalId = externalId;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public reset(): void {
    this._name = '';
    this._externalId = null;
    this._id = '';
  }

  public build(): Member | null {
    if (!this.validate()) return null;

    if (this._id) {
      return new Member(
        this._name,
        this._externalId,
        this._id,
      );
    }
    return new Member(
      this._name,
      this._externalId,
    );
  }

  private validate(): boolean {
    if (this._name) return true;
    return false;
  }
}
