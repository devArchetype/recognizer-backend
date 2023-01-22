export type UserDTO = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
};

export type GroupDTO = {
  id?: string;
  name?: string;
  userId?: string
};
