import {NgModule} from "@angular/core";

import {ShoppingListComponent} from "./shopping-list.component";
import {ShoppingEditComponent} from "./shopping-edit/shopping-edit.component";
import {ShoppingListRouterModule} from "./shopping-list-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    FormsModule,
    ShoppingListRouterModule,
    SharedModule
  ],
  exports: [
    ShoppingEditComponent
  ]
})

export class ShoppingListModule {

}
