import {Person} from './person';
import {Client} from './client';
import {Address} from './address';

export interface Employer {
  id: string;
  // person: Person;
  dateOfBirth?: string;
  lastName?: string;
  firstName: string;
  email?: string;
  telephone?: string;
  // address: Address;
  // client: Client;
  gender?: string;
  contactData?: string;

  street: string;
  zipCode: string;
  city: string;
  country: string;

  company: string;
  position: string;
  clients?: Client[];
}
