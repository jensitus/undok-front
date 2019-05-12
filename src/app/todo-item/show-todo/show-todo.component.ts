import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
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
  todo: any;
  todo_title: string;
  loading = false;
  submitted = false;
  item: any;
  addUserForm: FormGroup;
  users: User[];
  user_id: string;
  todo_users: User[];
  selectedUser: User;
  data: any;

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
      this.todo_users = this.todo.users;
      this.items = this.todo.items;
      this.items = this.items.sort();
      this.todo_id = this.todo.id;
      this.alertService.success('here you can manage your business', true);
    }, error => {
      this.alertService.error(error);
    });
    this.getItemForm();
    this.getAddUserForm();
  }

  get f() {
    return this.itemForm.controls;
  }

  get sortedItems() {
    return this.items.sort((a, b) => {
      return <any>new Date(b.created_at) - <any>new Date(a.created_at);
    });
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
      this.data = JSON.stringify({data});
      this.alertService.success('yes, you did it', false);
      this.getTodoItems();
      this.itemForm.reset();
      this.loading = false;
      this.data = data;
      console.log('Data:', this.data);
    }, error => {
      this.alertService.error(error, true);
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
    console.log('this.assUserForm: ' + this.addUserForm.value['selectedUser'].id);
    console.log(this.todo.id);
    this.loading = true;
    this.user_id = this.addUserForm.value['selectedUser'].id;
    this.todoService.addUserToTodo(this.todo.id, this.user_id).subscribe(data => {
      this.getUserForTodo();
      this.data = data;
      this.loading = false;
      this.alertService.success(this.data.message);
    }, error => {
      this.alertService.error(error);
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
      this.getTodoItems();
      this.loading = false;
    }, error => {
      this.alertService.error(error);
    });

    // this.todoService.getTodoItem(this.todo_id, item_id).pipe(
    //   tap(data1 => this.item = data1),
    //   concatMap(data1 => this.todoService.updateTodoItem(this.todo_id, this.item.id, this.item)),
    // ).subscribe(data2 => {
    //   this.updatedItem = data2;
    //   console.log('updatedItem: ', this.updatedItem);
    // });

  }

  deleteItem(item_id) {
    this.loading = true;
    this.todoService.deleteTodoItem(this.todo_id, item_id).subscribe(data => {
      this.data = data;
      this.alertService.success(this.data.text, true);
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
    this.addUserForm = this.formBuilder.group({
      user_id: [],
      selectedUser: this.selectedUser
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

  loadUser() {
    console.log('loadUser()');
    this.getUsers();
  }

}
