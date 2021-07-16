import {Client} from './client';
import {Address} from './address';

export interface Person {
  id: string;
  type: string;
  // sex: string;
  dateOfBirth?: string;
  lastName?: string;
  firstName: string;
  address: Address;
  client: Client;
}
