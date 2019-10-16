import {Description} from './description';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class Item {
  id: number;
  name: string;
  done: boolean;
  description: Description;
  dueDate: NgbDateStruct;
  created_at: any;
}
