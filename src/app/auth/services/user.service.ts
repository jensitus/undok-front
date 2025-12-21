import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {ChangePwDto} from '../model/change-pw-dto';
import {Observable} from 'rxjs';
import {SetAdminDto} from '../../admin-template/layout/dashboard/components/show-users/model/set-admin-dto';
import {ResponseMessage} from '../../common/helper/response-message';
import {SecondFactorForm} from '../model/second-factor-form';
import {LockUser} from '../user/user.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);
  apiUrl = environment.api_url;

  constructor() { }

  getAll(): Observable<User[]> {
    const url = `${this.apiUrl}/service/users/all`;
    console.log(url);
    return this.http.get<User[]>(url);
  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/service/users/by_username/' + username);
  }

  forgotPassword(email: string) {
    return this.http.post(this.apiUrl + '/service/auth/reset_password', email);
  }

  checkTokenExpired(token: string, email: string) {
    return this.http.get(`${this.apiUrl}/service/auth/reset_password/${token}/edit?email=` + email);
  }

  resetPassword(user: User, token: string, email: string) {
    return this.http.put(this.apiUrl + '/service/auth/reset_password/' + token + '?email=' + email, user);
  }

    checkAuthToken(token: string | undefined) {
    return this.http.post(this.apiUrl + '/service/users/auth/check_auth_token', token);
  }

  uploadAvatar(avatar: any, username: string) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post(`${this.apiUrl}/service/users/${username}/updateavatar`, formData);
  }

  confirmAccount(token: string, email: string): Observable<ResponseMessage> {
    const url = this.apiUrl + '/service/auth/' + token + '/confirm/' + email;
    return this.http.get<ResponseMessage>(this.apiUrl + '/service/auth/' + token + '/confirm/' + email);
  }

  changePassword(changePwDto: ChangePwDto) {
    return this.http.post(this.apiUrl + '/service/users/changepw', changePwDto);
  }

  setAdmin(user_id: string, setAdminDto: SetAdminDto): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(this.apiUrl + '/service/users/set-admin/' + user_id, setAdminDto);
  }

  sendSecondFactorToken(secondFactorForm: SecondFactorForm): Observable<any> {

    return this.http.post<any>(this.apiUrl + '/service/second-factor-auth/second-factor', secondFactorForm);
  }

  resendConfirmationLink(userId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/service/users/resend-confirmation-link', userId);
  }

  lockUser(lockUser: LockUser): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(this.apiUrl + '/service/users/' + lockUser.id + '/lock', lockUser);
  }

}
