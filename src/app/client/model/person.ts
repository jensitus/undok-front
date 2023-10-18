import {Client} from './client';
import {Address} from './address';

export interface Person {
  id: string;
  type: string;
  dateOfBirth?: string;
  lastName?: string;
  firstName: string;
  email?: string;
  telephone?: string;
  address: Address;
  client: Client;
  gender?: string;
  contactData?: string;
}
