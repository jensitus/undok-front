import {Role} from './role';

export class User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  passwordConfirmation?: string;
  auth_token?: string;
  avatar?: string;
  admin?: boolean;
  roles?: Role[];
  changePassword?: boolean;
}
