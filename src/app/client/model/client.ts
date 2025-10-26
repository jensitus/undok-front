import {Counseling} from './counseling';
import {Person} from './person';
import {Case} from './case';
import {Category} from './category';

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
  closedCases?: Case[];
  openCase?: Case;
  jobFunctions?: Category[];
  workingRelationship?: string;
  humanTrafficking?: boolean;
  jobCenterBlock?: boolean;

  furtherContact?: string;
  comment?: string;

  alert?: boolean;

}
