import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";

import {Ingredient} from "../../shared/ingredients.model";
import * as fromApp from "../../store/app.reducer";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import * as RecipesActions from '../store/recipe.actions';
import {map, switchMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  detailedRecipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.route.params.pipe(map(params => {
      return +params['id'];
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }),map(recipesState => {
      return recipesState.recipes.find((recipe, index) => {
        return index === this.id;
      })
    })). subscribe(recipe => {
          this.detailedRecipe = recipe;
        })
  }

  onSendIngredients(arr: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(arr));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeletRecipe(this.id));
    this.router.navigate(['/recipes'])
  }

}
