import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../services/todo.service';
import {AlertService} from '../../auth/services/alert.service';
import {Todo} from '../model/todo';
import {Item} from '../model/item';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../auth/model/user';
import {UserService} from '../../auth/services/user.service';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-show-todo',
  templateUrl: './show-todo.component.html',
  styleUrls: ['./show-todo.component.css']
})
export class ShowTodoComponent implements OnInit {

  itemForm: FormGroup;
  todo_id: string;
  items: Item[];
  todo: Todo;
  todo_title: string;
  loading = false;
  submitted = false;
  item: any;
  addUserForm: FormGroup;
  users: User[];
  user_id: string;
  todo_users: User[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.commonService.checkAuthToken();
    this.activatedRoute.params.subscribe(params => {
      this.todo_id = params['id'];
    });
    this.todoService.getTodo(this.todo_id).subscribe(data => {
      this.todo = data;
      this.todo_title = this.todo.title;
    }, error => {
      this.alertService.error(error);
    });
    this.getTodoItems();
    this.getItemForm();
    this.getAddUserForm();
    this.getUserForTodo();
  }

  get f() {
    return this.itemForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    this.loading = true;
    this.item = {
      name: this.itemForm.value.name,
      done: false
    };
    this.todoService.createTodoItem(this.todo_id, this.item).subscribe(data => {
      this.alertService.success('yes, you did it', false);
      this.getTodoItems();
      this.itemForm.reset();
      this.loading = false;
    }, error => {
      this.alertService.error(error);
    });
  }

  get u() {
    return this.addUserForm.controls;
  }

  addUserToTodo() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    console.log('this.assUserForm: ' + this.addUserForm.value['user_id']);
    this.loading = true;
    this.user_id = this.addUserForm.value['user_id'];
    this.todoService.addUserToTodo(this.todo.id, this.user_id).subscribe(data => {
      this.getUserForTodo();
      this.loading = false;
    }, error => {
      this.alertService.error(error);
      this.loading = false;
    });
  }

  updateTodoItem(item_id) {
    this.loading = true;
    this.todoService.getTodoItem(this.todo_id, item_id).subscribe(data => {
      this.item = data;
      this.item.done = !this.item.done;
      console.log(this.item);
      this.todoService.updateTodoItem(this.todo_id, this.item.id, this.item).subscribe(updateSuccess => {
        this.alertService.success('item successfully done', false);
        this.getTodoItems();
      }, error => {
        this.alertService.error(error, false);
      });
      this.loading = false;
    }, error => {
      this.alertService.error(error, false);
    });
  }

  deleteItem(item_id) {
    this.loading = true;
    this.todoService.deleteTodoItem(this.todo_id, item_id).subscribe(data => {
      this.alertService.success('item successfully deleted', true);
      this.getTodoItems();
      this.loading = false;
    }, error => {
      this.alertService.error(error, true);
      this.loading = false;
    });
  }

  private getTodoItems() {
    this.todoService.getTodoItems(this.todo_id).subscribe(data => {
      this.items = data;
    }, error => {
      this.alertService.error(error);
    });
  }

  private getItemForm() {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  private getAddUserForm() {
    this.getUsers();
    this.addUserForm = this.formBuilder.group({
      user_id: []
    });
  }

  private getUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    }, error => {
      console.log(error);
    });
  }

  private getUserForTodo() {
    this.todoService.getTodoUsers(this.todo_id).subscribe(data => {
      this.todo_users = data;
    }, error => {
      this.alertService.error(error);
    });
  }

}
