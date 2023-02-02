import validator from 'validator';
import { BadRequestError } from '../../errors/api-erros';
import Builder from '../interfaces/builder.protocol';
import Answer from '../entities/Answer';

export default class AnswerBuilder implements Builder {
  constructor(
    private _id: string = '',
    private _template: string = '',
    private _templatePicture: string = '',
    private _membersId: string = '',
    private _exameId: string = '',
  ) {}

  public get template(): string {
    return this._template;
  }

  public set template(template: string) {
    this._template = template;
  }

  public get templatePicture(): string {
    return this._templatePicture;
  }

  public set templatePicture(templatePicture: string) {
    this._templatePicture = templatePicture;
  }

  public get exameId(): string {
    return this._exameId;
  }

  public set exameId(exameId: string) {
    this._exameId = exameId;
  }

  public get membersId(): string {
    return this._membersId;
  }

  public set membersId(membersId: string) {
    this._membersId = membersId;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public reset(): void {
    this._membersId = '';
    this._exameId = '';
    this._template = '';
    this._templatePicture = '';
    this._id = '';
  }

  public build(): Answer | null {
    if (!this.validate()) return null;

    if (this._id) {
      return new Answer(
        this._template,
        this._templatePicture,
        this._membersId,
        this._exameId,
        this._id,
      );
    }

    return new Answer(
      this._template,
      this._templatePicture,
      this._membersId,
      this._exameId,
    );
  }

  private validate(): boolean {
    return !!(this._template && this._templatePicture);
  }
}
