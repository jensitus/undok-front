import {Role} from './role';

export class User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  passwordConfirmation?: string;
  accessToken?: string;
  avatar?: string;
  admin?: boolean;
  roles?: Role[];
  changePassword?: boolean;
}
