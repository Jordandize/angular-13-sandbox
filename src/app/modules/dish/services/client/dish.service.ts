import { Injectable } from '@angular/core';
import { DishForm } from '../../models/client/dish-form.model';
import { Dish } from '../../models/server/dish.model';

@Injectable({
    providedIn: 'root'
})
export class DishService {

    public fromDishForm(form: DishForm): Dish {
        if (!form) {
            return null;
        }
        return {
            id: null,
            name: form.name,
            categoryId: form.category,
            tags: form.tags,
        };
    }

}
