import {Description} from './description';

export class Item {
  id: number;
  name: string;
  done: boolean;
  description: Description;
  dueDate: Date;
  created_at: any;
}
