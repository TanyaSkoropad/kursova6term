import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from "rxjs";
import * as fromApp from '../store/app.reducer'
import {Store} from "@ngrx/store";
import {map} from "rxjs/internal/operators";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => {
      return authState.user
    })).subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  onSave() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetch() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogOut() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
