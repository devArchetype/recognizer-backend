export type UserDTO = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
};

export type MemberDTO = {
  id?: string;
  name?: string;
  externalId?: string | null;
  groupId?: string;
};

export type GroupDTO = {
  id?: string;
  name?: string;
  userId?: string
};

export type ExamDTO = {
  name?: string,
  description?: string | null,
  examDate?: Date | null,
  template?: string,
  groupId?: string,
  id?: string,
};

export type AnswerDTO = {
  id?: string;
  template?: string;
  templatePicture?: string;
  membersId?: string;
  exameId?: string;
};
