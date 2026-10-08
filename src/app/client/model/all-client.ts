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
  /** Sektor from join_category, scoped to the client's open case. */
  sector?: Category[];
  union: string;
  membership: boolean;
  organization: string;
  /**
   * The case that currently represents this client: the open one if there is one, otherwise
   * the most recently closed one. All five are undefined when the client has no case at all.
   */
  caseId?: string;
  caseStatus?: 'OPEN' | 'CLOSED';
  caseStartDate?: string;
  caseEndDate?: string;
  referredTo?: string;
}
