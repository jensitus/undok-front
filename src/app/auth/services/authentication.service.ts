import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';

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
        this.u = {
          id: user.userDto.id,
          username: user.userDto.username,
          email: user.userDto.email,
          password: '',
          auth_token: user.userDto.accessToken,
          avatar: user.userDto.avatar
        };
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

}
