import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl = 'http://localhost:3000';
  u: User;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl + '/auth/login', { email: email, password: password }).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.auth_token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.u = {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email,
          password: '',
          auth_token: user.auth_token
        };
        console.log('this.u:');
        console.log(this.u);
        localStorage.setItem('currentUser', JSON.stringify(this.u));
      }
      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
