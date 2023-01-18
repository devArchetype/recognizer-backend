import User from '@entities/User';
import Builder from '@interfaces/builder';

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
    this._name = name;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get password(): string {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }

  public reset(): void {
    this._name = '';
    this._email = '';
    this._password = '';
    this._avatar = null;
    this._id = '';
  }

  public build(): User {
    if (this._id) return new User(this._name, this._email, this._password, this._avatar, this._id);
    return new User(this._name, this._email, this._password, this._avatar);
  }
}