import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DishCard } from '../../models/client/dish-card.model';
import { Dish } from '../../models/server/dish.model';
import { CategoryStoreService } from '../store/category-store.service';

@Injectable({
    providedIn: 'root'
})
export class DishCardService {

    constructor(private categoryStoreService: CategoryStoreService) {
    }

    public fromDish = (dish: Dish): Observable<DishCard> =>
        this.categoryStoreService.getCategoriesMap().pipe(
            map((categoriesMap): DishCard => dish && ({
                name: dish.name,
                category: categoriesMap[dish.categoryId].name,
                tagsText: dish.tags.join(", "),
            })),
        );

}
