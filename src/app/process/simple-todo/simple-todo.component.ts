import {Component, Input, OnInit} from '@angular/core';
import {TodoService} from '../../todo-item/services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-simple-todo',
  templateUrl: './simple-todo.component.html',
  styleUrls: ['./simple-todo.component.css']
})
export class SimpleTodoComponent implements OnInit {

  @Input() item: any;
  @Input() todo_id: string;
  loading: boolean;
  data: any;

  constructor(
    private todoService: TodoService,
    private alertService: AlertService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  deleteItem(item_id) {
    this.loading = true;
    this.todoService.deleteTodoItem(this.todo_id, item_id).subscribe(data => {
      this.data = data;
      this.alertService.success(this.data.text, true);
      this.commonService.setItemSubject(true);
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  updateTodoItem(item_id) {
    this.loading = true;
    this.item = {
      id: item_id
    };
    this.todoService.updateTodoItem(this.todo_id, item_id, this.item).subscribe(data => {
      this.item = data;
      if (this.item.done === true) {
        this.alertService.success('item successfully done', false);
      } else if (this.item.done === false) {
        this.alertService.success('item is still open', false);
      }
      this.loading = false;
    });
  }

}
