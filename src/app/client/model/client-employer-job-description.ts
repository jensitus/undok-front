import {Employer} from './employer';

export interface ClientEmployerJobDescription {
  id: string;
  employer: Employer;
  from: string;
  until: string;
  industry: string;
  industrySub: string;
  jobFunction: string;
  jobRemarks: string;
}
