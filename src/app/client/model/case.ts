import {Counseling} from './counseling';
import {Category} from './category';

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
  targetGroup?: string;
  workingRelationship?: string;
  humanTrafficking?: boolean;
  jobCenterBlock?: boolean;
  counselingLanguages?: Category[];
  jobMarketAccess?: Category[];
  originOfAttention?: Category[];
  undocumentedWork?: Category[];
  complaints?: Category[];
  industryUnion?: Category[];
  jobFunction?: Category[];
  sector?: Category[];
}
