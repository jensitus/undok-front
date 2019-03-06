import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user_id: number;
  userForm: FormGroup;
  user: any;
  data: any;
  avatar: any;
  file: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.user_id = params['id'];
    });
    this.userForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
    this.userService.getById(this.user_id).subscribe(data => {
      this.data = data;
      if (this.data.avatar === null) {
        this.avatar = '';
      } else {
        this.avatar = this.data.avatar;
      }
      this.user = {
        id: this.data.id,
        name: this.data.name,
        email: this.data.email
      };
      this.userForm.setValue(this.user);
    }, error => {
      this.alertService.error(error);
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    console.log(this.userForm.value);
  }

  onUpload(event) {
    console.log(event.files);
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: 'aber hallo'});
    for (this.file of event.files) {
      console.log(this.file);
      console.log(this.user_id);
      this.userService.uploadAvatar(this.file, this.user_id).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

}
