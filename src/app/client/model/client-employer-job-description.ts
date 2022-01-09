import {Employer} from './employer';

export interface ClientEmployerJobDescription {
  employer: Employer;
  from: string;
  until: string;
  industry: string;
  industrySub: string;
  jobFunction: string;
  jobRemarks: string;
}
