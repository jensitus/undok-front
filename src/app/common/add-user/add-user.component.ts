import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {UserService} from '../../auth/services/user.service';
import {User} from '../../auth/model/user';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  loading = false;
  submitted = false;
  addUserForm: UntypedFormGroup;
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
    private formBuilder: UntypedFormBuilder,
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

  }

}
