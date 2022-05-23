import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";

import * as AuthActions from './auth.actions';
import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";
import {AuthService} from "../auth.service";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean,
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occured';
  if (!errorRes.error || !errorRes.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email is not found';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is invalid';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};


@Injectable()

export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCmXMwyyHJ4CzL5rUp0BRvkk3_cCzmtITA',
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        )
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmXMwyyHJ4CzL5rUp0BRvkk3_cCzmtITA',
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          }))
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccesAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccesAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'IDENTIFIER'};
      }

      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpDate));
      if (loadedUser.token) {
        const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpDate),
          redirect: false,
        });
        // const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
        // this.autoLogout(expDuration);
      }
      return {type: 'IDENTIFIER'};
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
    this.authService.clearLogoutTimer();
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }));

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {

  }
}
