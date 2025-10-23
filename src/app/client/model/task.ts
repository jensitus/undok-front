export interface Task {
  id: number;
  caseId: string;
  title: string;
  description?: string;
  status?: string;
  dueDate?: Date;
  requiredTime?: number;
  createdBy?: string;
  createdAt?: Date;
}
