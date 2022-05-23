import {NgModule} from "@angular/core";
import {ShoppingListComponent} from "./shopping-list.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: ShoppingListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShoppingListRouterModule {

}
