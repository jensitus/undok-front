import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  username: string;
  userForm: FormGroup;
  user: any;
  data: any;
  avatar: any;
  file: any;
  submitted = false;
  avatar_upload_url: string;
  apiUrl = environment.api_url;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });
    this.userForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
    this.userService.getByUsername(this.username).subscribe(data => {
      this.data = data;
      console.log('this.data', this.data);
      if (this.data.avatar === null) {
        this.avatar = '';
      } else {
        this.avatar = this.data.avatar;
      }
      this.user = {
        id: this.data.id,
        name: this.data.username,
        email: this.data.email
      };
      this.userForm.setValue(this.user);
    }, error => {
      this.alertService.error(error);
    });
    this.avatar_upload_url = this.apiUrl + '/users/' + this.username + '/updateavatar';
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    console.log(this.userForm.value);
  }

  onUpload(event) {
    console.log(event.files);
    // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: 'aber hallo'});
    for (this.file of event.files) {
      console.log(this.file);
      console.log(this.username);
      this.userService.uploadAvatar(this.file, this.username).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

}
