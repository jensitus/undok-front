import {Person} from './person';

export interface Employer {
  person: Person;
  employerCompany: string;
  employerPosition: string;
}
