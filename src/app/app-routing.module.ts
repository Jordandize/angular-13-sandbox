import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: "dish",
        loadChildren: () => import("./modules/dish/dish.module").then((m) => m.DishModule),
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "dish",
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
