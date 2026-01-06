import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {AuthGuard} from './auth/guards/auth.guard';
import {UserService} from './auth/services/user.service';
import {AuthenticationService} from './auth/services/authentication.service';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtInterceptor} from './auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from './common/helper/error.interceptor';
import {DecimalPipe} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    AuthGuard,
    UserService,
    AuthenticationService,
    // Provide HttpClient in the standalone app and wire up interceptors from DI
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    DecimalPipe]
};
