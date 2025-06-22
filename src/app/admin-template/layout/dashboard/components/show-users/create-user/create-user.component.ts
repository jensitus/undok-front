import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../../../../auth/services/user.service';
import {AlertService} from '../../../../components/alert/services/alert.service';
import {AuthenticationService} from '../../../../../../auth/services/authentication.service';
import {first} from 'rxjs/operators';
import {CommonService} from '../../../../../../common/services/common.service';
import {CreateUserForm} from '../../../../../../auth/model/create-user-form';
import {ResponseMessage} from '../../../../../../common/helper/response-message';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  loading = false;
  submitted = false;
  error: string;
  username: string;
  password: string;
  email: string;
  admin = false;
  createUserForm: CreateUserForm;
  responseMessage: ResponseMessage;
  confUrl: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    this.createUserForm = {
      username: this.username,
      email: this.email,
      admin: this.admin
    };
    this.loading = true;
    this.authService.createUserViaAdmin(this.createUserForm).pipe(first()).subscribe(data => {
        this.alertService.success('Registration successful', true);
        this.loading = false;
        this.commonService.setCreateUserSubject(true);
        this.username = null;
        this.email = null;
        this.responseMessage = data;
        this.confUrl = this.responseMessage.text;
      }, error => {
      this.alertService.error(error.error.text, true);
    });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

}
