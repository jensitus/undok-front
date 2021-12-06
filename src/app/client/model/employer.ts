import {Person} from './person';
import {Client} from './client';

export interface Employer {
  id: string;
  person: Person;
  company: string;
  position: string;
  clients?: Client[];
}
