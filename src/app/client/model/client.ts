import {MaritalStatus} from './marital-status.enum';

export interface Client {
  id: string;
  keyword: string;
  education: string;
  maritalStatus?: MaritalStatus;
  interpreterNecessary: boolean;
  howHasThePersonHeardFromUs: string;
  vulnerableWhenAssertingRights: boolean;
}
