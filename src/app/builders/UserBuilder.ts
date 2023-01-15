import Builder from '../interfaces/builder';
import User from '../models/User';

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

  public reset(): void {
    this._name = '';
    this._email = '';
    this._password = '';
    this._avatar = null;
    this._id = '';
  }

  public build(): User {
    return new User(this._name, this._email, this._password, this._avatar);
  }
}
