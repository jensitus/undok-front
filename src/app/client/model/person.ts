import {Client} from './client';

export interface Person {
  id: string;
  type: string;
  // sex: string;
  dateOfBirth?: string;
  lastName?: string;
  firstName: string;
  address: string;
  client: Client;
}
