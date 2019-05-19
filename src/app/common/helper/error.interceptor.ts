import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../../auth/services/authentication.service';
import {Router} from '@angular/router';
import {AlertService} from '../alert/services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log('error:', err);
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        // location.reload(true);
        this.router.navigate(['/login']);
      } else if (err.status === 409) {
        //   this.alertService.error('409');
        // } else if (err.error.message === 'Error -> Unauthorized') {
        //   this.router.navigate(['/login']);
      } else if (err.status === 406) {
        console.log('406', err.error.text);
        this.alertService.error(err.error.text);
        //   this.router.navigate(['/login']);
        // } else if (err.error.message === 'Missing token' || 'Signature has expired') {
        //   this.authenticationService.logout();
        //   this.alertService.error('you need to login', true);
        //   // this.router.navigate(['/login']);
      } else if (err.status === 422) {
        this.alertService.error('reset is expired', true);
        this.router.navigate(['/login']);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
