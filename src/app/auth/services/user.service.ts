import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(this.apiUrl + '/users/index');
  }

  getById(id: number) {
    return this.http.get(this.apiUrl + '/users/' + id);
  }

  register(user: User) {
    return this.http.post(this.apiUrl + '/signup', user);
  }

  forgotPassword(email: string) {
    return this.http.post(this.apiUrl + '/password_resets', email);
  }

  checkTokenExpired(token: string, email: string) {
    return this.http.get(`${this.apiUrl}/password_resets/${token}/edit?email=` + email);
  }

  resetPassword(user: User, token: string, email: string) {
    return this.http.put(this.apiUrl + '/password_resets/' + token + '?email=' + email, user);
  }

  checkAuthToken(token: string) {
    console.log('token ' + token);
    return this.http.post(this.apiUrl + '/users/check_auth_token', {token: token});
  }

}
