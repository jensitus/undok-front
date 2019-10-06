import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TodoService} from '../../todo-item/services/todo.service';
import {UserService} from '../../auth/services/user.service';
import {User} from '../../auth/model/user';
import {AlertService} from '../alert/services/alert.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  loading = false;
  submitted = false;
  addUserForm: FormGroup;
  @Input() user_id: string;
  todo_users: User[];
  users: User[];
  data: any;
  todo: any;
  @Input() todo_id: string;
  selectedUser: User;
  @Input() todo_title: string;
  showAF = false;

  constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUserForTodo();
    this.getAddUserForm();
  }

  showAddUserForm() {
    this.showAF = !this.showAF;
    if (this.showAF) {
      this.loadUser();
    } else {
      this.users = [];
    }
  }

  addUserToTodo() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    this.loading = true;
    console.log('addUserForm', this.addUserForm);
    this.user_id = this.addUserForm.value['selectedUser'];
    console.log('this.user_id', this.user_id);
    this.todoService.addUserToTodo(this.todo_id, this.user_id).subscribe(data => {
      this.getUserForTodo();
      this.data = data;
      this.loading = false;
      this.alertService.success('user successfully added');
    }, error => {
      // this.alertService.error(error);
      this.loading = false;
    });
  }

  get u() {
    return this.addUserForm.controls;
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
    });
  }

  loadUser() {
    console.log('loadUser()');
    this.getUsers();
  }

  private getUserForTodo() {
    this.todoService.getTodoUsers(this.todo_id).subscribe(data => {
      this.todo_users = data;
      console.log('todousers', this.todo_users);
    }, error => {
      // this.alertService.error(error);
    });
  }

}
