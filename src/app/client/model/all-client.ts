import {MaritalStatus} from './marital-status.enum';
import {Counseling} from './counseling';
import {Person} from './person';

export interface AllClient {
  id: string;
  keyword: string;

  // person:
  firstName: string;
  lastName?: string;
  type: string;
  // sex: string;
  dateOfBirth?: string;

  // address:
  street: string;
  zipCode: string;
  city: string;
  country: string;

  education: string;
  maritalStatus?: MaritalStatus;
  interpreterNecessary: boolean;
  howHasThePersonHeardFromUs: string;
  vulnerableWhenAssertingRights: boolean;
  counselings: Counseling[];

  nationality: string;
  language: string;
  currentResidentStatus: string;
  formerResidentStatus?: string;
  labourMarketAccess: string;
  position: string;
  sector: string;
  union: string;
  membership: boolean;
  organization: string;
}
