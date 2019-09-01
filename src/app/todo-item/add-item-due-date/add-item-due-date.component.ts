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
    console.log(this.dueDate);
    this.todoService.setItemDueDate(this.todo_id, this.item.id, this.dueDate).subscribe( result => {
      console.log(result);
      // this.commonService.setDueDateSubject(true);
    });
  }

}
