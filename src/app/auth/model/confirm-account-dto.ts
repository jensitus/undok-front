export interface ConfirmAccountDto {
  confirmationToken: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  oldPassword: string;
}
