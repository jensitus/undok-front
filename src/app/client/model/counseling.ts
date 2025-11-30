import {Category} from './category';
import {Case} from './case';

export interface Counseling {
  id: string;
  counselingStatus: string;
  entryDate: string;
  concern: string;
  activity: string;
  legalCategory?: Category[];
  activityCategories?: Category[];
  registeredBy: string;
  counselingDate: string;
  clientId: string;
  clientFullName: string;
  comment?: string;
  keyword: string;
  requiredTime: number;
  counselingCase?: Case;
}
