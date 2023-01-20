import User from '@entities/User';
import { BadRequestError } from '@erros/api-erros';
import Builder from '@interfaces/builder';

import validator from 'validator';

export default class UserBuilder implements Builder {
  constructor(
    private _name: string = '',
    private _email: string = '',
    private _password: string = '',
    private _avatar: string | null = null,
    private _id: string = '',
  ) {}

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    if (validator.isEmpty(name)) {
      throw new BadRequestError('Nome inválida');
    }

    this._name = name;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    if (!validator.isEmail(email)) {
      throw new BadRequestError('Email inválido');
    }

    this._email = email;
  }

  public get password(): string {
    return this._password;
  }

  public set password(password: string) {
    if (validator.isEmpty(password)) {
      throw new BadRequestError('Senha inválida');
    }

    this._password = password;
  }

  public get avatar(): string {
    return this._avatar ?? '';
  }

  public set avatar(avatar: string) {
    this._avatar = avatar;
  }

  public reset(): void {
    this._name = '';
    this._email = '';
    this._password = '';
    this._avatar = null;
    this._id = '';
  }

  public build(): User | null {
    if (!this.validate()) return null;

    if (this._id) {
      return new User(this._name, this._email, this._password, this._avatar, this._id);
    }
    return new User(this._name, this._email, this._password, this._avatar);
  }

  private validate(): boolean {
    if (this._name && this._email && this._password) return true;
    return false;
  }
}
