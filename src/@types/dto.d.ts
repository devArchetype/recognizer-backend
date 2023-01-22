export type UserDTO = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
};

export type MemberDTO = {
  id: string;
  name: string;
  externalId: string | null;
};
