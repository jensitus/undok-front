import {Category} from './category';
import {JoinCategory} from './join-category';

export interface ClientForm {
  // Person:
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
  telephone?: string;
  gender?: string;

  // client:
  keyword?: string;
  education?: string;
  maritalStatus?: string;
  interpreterNecessary?: boolean;
  howHasThePersonHeardFromUs?: string;
  vulnerableWhenAssertingRights?: boolean;
  nationality?: string;
  language?: string;
  currentResidentStatus?: string;
  formerResidentStatus?: string;
  labourMarketAccess?: string;
  position?: string;
  union?: string;
  membership?: boolean;
  organization?: string;
  socialInsuranceNumber?: string;

  // Adress:
  street?: string;
  zipCode?: string;
  city?: string;
  country?: string;

  targetGroup?: string;
  workingRelationship?: string;
  humanTrafficking?: boolean;
  jobCenterBlock?: boolean;

  jobMarketAccessSelected?: JoinCategory[];
  counselingLanguageSelected?: JoinCategory[];
  originOfAttentionSelected?: JoinCategory[];
  undocumentedWorkSelected?: JoinCategory[];
  complaintsSelected?: JoinCategory[];
  industryUnionSelected?: JoinCategory[];
  jobFunctionSelected?: JoinCategory[];
  sectorSelected?: JoinCategory[];

  selectedJobMarketAccess?: Category[];
  selectedCounselingLanguages?: Category[];
  selectedOriginOfAttention?: Category[];
  undocumentedWork?: Category[];
  complaints?: Category[];
  industryUnion?: Category[];
  jobFunction?: Category[];
  sector?: Category[];

  furtherContact?: string;
  comment?: string;

  alert?: boolean;
}
