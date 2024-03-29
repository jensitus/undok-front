import {Counseling} from './counseling';
import {Person} from './person';

export interface Client {
  id: string;
  keyword: string;
  education: string;
  maritalStatus?: string;
  interpreterNecessary: boolean;
  howHasThePersonHeardFromUs: string;
  vulnerableWhenAssertingRights: boolean;
  counselings: Counseling[];
  person: Person;

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
  socialInsuranceNumber: string;

}
