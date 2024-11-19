import {Category} from './category';

export interface AllCounseling {
  id: string;
  counselingStatus: string;
  entryDate: string;
  concern: string;
  concernCategory: string;
  activity: string;
  activityCategory: string;
  registeredBy: string;
  counselingDate: Date;
  clientId: string;
  clientFullName: string;
  comment?: string;
  keyword: string;
}
