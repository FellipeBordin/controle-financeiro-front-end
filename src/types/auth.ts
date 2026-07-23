export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
  token: string;
  user: User;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
