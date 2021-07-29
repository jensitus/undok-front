import {MaritalStatus} from './marital-status.enum';
import {Country} from './country.enum';

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
  // Adress:
  street: string;
  zipCode: string;
  city: string;
  country: string;
}
