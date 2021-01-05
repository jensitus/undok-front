import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoService} from '../../todo-item/services/todo.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-complex-todo',
  templateUrl: './complex-todo.component.html',
  styleUrls: ['./complex-todo.component.css']
})
export class ComplexTodoComponent implements OnInit {

  @Input() item: any;
  @Input() todo_id: string;
  displayUpdateDescription = false;
  descriptionForm: FormGroup;
  data: any;
  description: any;
  displayItem = false;
  display_item_id: number;
  loading = false;
  submitted = false;
  reload = false;
  dueDate: Date;
  faTrash = faTrash;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private alertService: AlertService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.dueDate = this.item.dueDate;
  }

  get d() {
    return this.descriptionForm.controls;
  }

  openItem(item_id) {
    this.displayItem = !this.displayItem;
    this.display_item_id = item_id;
    this.displayUpdateDescription = false;
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
      this.displayItem = false;
    });
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

}
