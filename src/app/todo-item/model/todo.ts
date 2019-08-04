import {Item} from './item';

export class Todo {
  id: number;
  title: string;
  created_by: string;
  items: Item[];
}
