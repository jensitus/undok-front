import {Person} from './person';

export interface Employer {
  id: string;
  person: Person;
  company: string;
  position: string;
}
