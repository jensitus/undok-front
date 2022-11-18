import {Category} from './category';

export interface Counseling {
  id: string;
  counselingStatus: string;
  entryDate: string;
  concern: string;
  concernCategory: string;
  activity: string;
  legalCategory: Category[];
  registeredBy: string;
  counselingDate: string;
  clientId: string;
  clientFullName: string;
  comment?: string;
  keyword: string;
}
