import Builder from '@interfaces/builder.protocol';
import Exams from '@entities/Exam';
import validator from 'validator';
import { BadRequestError } from '@erros/api-erros';

export default class ExamsBuilder implements Builder {
  constructor(
    private _name: string = '',
    private _description: string | null = null,
    private _examDate: Date | null = null,
    private _template: string = '',
    private _groupId: string = '',
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

  public get description(): string | null {
    return this._description;
  }

  public set description(description: string | null) {
    this._description = description;
  }

  public get examDate(): Date | null {
    return this._examDate;
  }

  public set examDate(examDate: Date | null) {
    this._examDate = examDate;
  }

  public get template(): string {
    return this._template;
  }

  public set template(template: string) {
    if (validator.isEmpty(template)) {
      throw new BadRequestError('Nome inválido');
    }

    this._template = template;
  }

  public get groupId(): string {
    return this._groupId;
  }

  public set groupId(groupId: string) {
    if (validator.isEmpty(groupId)) {
      throw new BadRequestError('Nome inválido');
    }

    this._groupId = groupId;
  }

  public reset(): void {
    this._name = '';
    this._description = null;
    this._examDate = null;
    this._template = '';
    this._groupId = '';
    this._id = '';
  }

  public build(): Exams {
    if (this._id) {
      return new Exams(
        this._name,
        this._description,
        this._examDate,
        this._template,
        this._groupId,
        this._id,
      );
    }
    return new Exams(
      this._name,
      this._description,
      this._examDate,
      this._template,
      this._groupId,
    );
  }
}
