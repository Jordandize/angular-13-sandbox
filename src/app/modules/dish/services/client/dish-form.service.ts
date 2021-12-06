import { Injectable } from '@angular/core';
import { DishForm } from '../../models/client/dish-form.model';
import { Dish } from '../../models/server/dish.model';

@Injectable({
    providedIn: 'root'
})
export class DishFormService {

    public fromDish(dish: Dish): DishForm {
        if (!dish) {
            return null;
        }
        return {
            name: dish.name,
            category: dish.categoryId,
            tags: dish.tags,
        };
    }

}
