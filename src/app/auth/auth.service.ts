import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private tokenExpTimer: any;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(expDuration: number) {
    console.log(expDuration);
    this.tokenExpTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout())
    }, expDuration)
  }

  clearLogoutTimer() {
    if(this.tokenExpTimer){
      clearTimeout(this.tokenExpTimer);
      this.tokenExpTimer = null;
    }
  }
}

