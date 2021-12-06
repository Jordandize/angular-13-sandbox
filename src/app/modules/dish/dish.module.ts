import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishRoutingModule } from './dish-routing.module';
import { DishListPageComponent } from './pages/dish-list-page/dish-list-page.component';
import { DishCardComponent } from './components/dish-card/dish-card.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishPopoverComponent } from './components/dish-popover/dish-popover.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
    declarations: [
        DishListPageComponent,
        DishCardComponent,
        DishFormComponent,
        DishPopoverComponent,
    ],
    imports: [
        CommonModule,
        DishRoutingModule,
        ReactiveFormsModule,
        ReactiveComponentModule,
    ]
})
export class DishModule { }
