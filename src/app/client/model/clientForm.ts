import {MaritalStatus} from './marital-status.enum';

export interface ClientForm {
  firstName: string;
  lastName: string;
  keyword: string;
  education: string;
  dateOfBirth?: string;
  maritalStatus?: MaritalStatus;
  interpreterNecessary: boolean;
  howHasThePersonHeardFromUs: string;
  vulnerableWhenAssertingRights: boolean;
}
