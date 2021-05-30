import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {ConfirmAccountDto} from '../model/confirm-account-dto';
import {Observable} from 'rxjs';
import {ResponseMessage} from '../../common/helper/response-message';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl = environment.api_url;
  u: User;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl + '/service/auth/login', { username: username, password: password }).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.userDto.accessToken) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log('user', user);
        this.u = {
          id: user.userDto.id,
          username: user.userDto.username,
          email: user.userDto.email,
          password: '',
          auth_token: user.userDto.accessToken,
          roles: user.userDto.roles,
          avatar: user.userDto.avatar
        };
        this.setAdminFlag(this.u);
        console.log('this.u', this.u);
        localStorage.setItem('currentUser', JSON.stringify(this.u));
      }
      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  register(user: User) {
    return this.http.post(this.apiUrl + '/service/auth/signup', user);
  }

  confirmAccountAndSetNewPassword(confirmAccountDto: ConfirmAccountDto): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(this.apiUrl + '/service/auth/' + confirmAccountDto.confirmationToken + '/set_new_password', confirmAccountDto);
  }

  private setAdminFlag(user: User): void {
    for (const r of user.roles) {
      if (r.name === 'ADMIN') {
        console.log('ADMIN');
        this.u.admin = true;
      }
    }
  }

}
