import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DishListPageComponent } from './pages/dish-list-page/dish-list-page.component';


const routes: Routes = [
    {
        path: "list",
        component: DishListPageComponent,
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DishRoutingModule { }
