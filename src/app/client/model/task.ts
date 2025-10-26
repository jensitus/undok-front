export interface Task {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  status?: string;
  dueDate?: Date;
  requiredTime?: number;
  createdBy?: string;
  createdAt?: Date;
  clientId?: string;
}
