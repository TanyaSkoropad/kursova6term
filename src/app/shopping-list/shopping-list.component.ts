import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";

import {Ingredient} from '../shared/ingredients.model';
import * as fromApp from '../store/app.reducer'
import * as ShoppingListActions from './store/shopping-list.actions'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredientsArray: Observable<{ ingredients: Ingredient[] }>;
  // private igChangeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.ingredientsArray = this.store.select('shoppingList');
    // this.ingredientsArray = this.shoppingListService.getIngredients();
    // this.igChangeSub = this.shoppingListService.copyOfIngredients.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredientsArray = ingredients;
    // })
  }

  onEditItem(id: number) {
    // this.shoppingListService.startedEditing.next(id);
    this.store.dispatch(new ShoppingListActions.StartEdit(id));
  }

  ngOnDestroy() {
    // this.igChangeSub.unsubscribe();
  }
}
