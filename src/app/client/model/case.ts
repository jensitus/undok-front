import {Counseling} from './counseling';

export interface Case {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  counselings?: Counseling[];
  status: string;
  startTime: Date;
  endTime?: Date;
  referredTo?: string;
  clientId: string;
}
