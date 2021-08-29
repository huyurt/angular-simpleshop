export interface IUser {
  email: string;
  displayName: string;
  token: string;
}

export class User implements IUser {
  email = '';
  displayName = '';
  token = '';
}
