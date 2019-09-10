import {Component, Input, OnInit} from '@angular/core';
import {TodoService} from '../services/todo.service';
import {Item} from '../model/item';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-add-item-due-date',
  templateUrl: './add-item-due-date.component.html',
  styleUrls: ['./add-item-due-date.component.css']
})
export class AddItemDueDateComponent implements OnInit {

  @Input() todo_id: string;
  @Input() item: Item;
  show_set_due_date: boolean;
  dueDate: Date;

  constructor(
    private todoService: TodoService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.show_set_due_date = false;
    console.log(this.item);
    this.dueDate = this.item.dueDate;
    // this.todoService.getTodoItem(this.todo_id, this.item_id).subscribe(result => {
    //   console.log(result);
    // });
  }

  showSetDueDate() {
    this.show_set_due_date = !this.show_set_due_date;
  }

  setTheDueDate() {
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    };
    console.log(this.dueDate);
    console.log(this.dueDate.getDay());
    console.log(this.dueDate.getMonth());
    console.log(this.dueDate.getFullYear());
    console.log(this.dueDate.toDateString());
    console.log(this.dueDate.toLocaleDateString('de-DE', options));
    // this.todoService.setItemDueDate(this.todo_id, this.item.id, this.dueDate.toLocaleDateString('de-DE', options)).subscribe( result => {
    //   console.log(result);
    //   // this.commonService.setDueDateSubject(true);
    // });
  }

}
