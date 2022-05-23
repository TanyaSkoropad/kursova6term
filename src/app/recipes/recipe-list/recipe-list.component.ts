import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {Recipe} from '../recipe.model';
import {Subscription} from "rxjs";
import * as fromApp from '../../store/app.reducer'
import {Store} from "@ngrx/store";
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipesArray: Recipe[] = [];
  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select('recipes')
      .pipe(
        map(recipesState => {
          return recipesState.recipes;
        }))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipesArray = recipes;
        }
      )
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
