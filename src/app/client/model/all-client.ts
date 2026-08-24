import {Counseling} from './counseling';
import {Category} from './category';

export interface AllClient {
  id: string;
  keyword: string;

  // person:
  firstName: string;
  lastName?: string;
  type: string;
  dateOfBirth?: string;
  gender?: string;

  // address:
  street: string;
  zipCode: string;
  city: string;
  country: string;

  education: string;
  maritalStatus?: string;
  interpreterNecessary: boolean;
  howHasThePersonHeardFromUs: string;
  vulnerableWhenAssertingRights: boolean;
  counselings: Counseling[];

  nationality: string;
  language: string;
  /** Aufenthaltstitel from join_category, scoped to the client's open case. */
  residenceStatus?: Category[];
  formerResidentStatus?: string;
  labourMarketAccess: string;
  position: string;
  sector: string;
  union: string;
  membership: boolean;
  organization: string;
}
