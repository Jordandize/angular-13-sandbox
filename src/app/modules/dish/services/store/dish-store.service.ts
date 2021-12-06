import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import { Dish } from '../../models/server/dish.model';
import { DishRestService } from '../server/dish-rest.service';

@Injectable({
    providedIn: 'root'
})
export class DishStoreService {

    constructor(private dishRestService: DishRestService) { }

    private dishListSubject = new BehaviorSubject<Dish[]>([]);
    private dishList$ = this.dishListSubject.asObservable();

    private get dishList(): Dish[] {
        return this.dishListSubject.value;
    }

    public loadDishList(): void {
        this.dishRestService.getDishList().subscribe((dishList: Dish[]) => {
            this.setDishList(dishList);
        });
    }

    public getDishList(): Observable<Dish[]> {
        return this.dishList$;
    }

    public createDish(dishToCreate: Dish): void {
        this.dishRestService.createDish(dishToCreate).subscribe((createdDish: Dish) => {
            this.setDishList([
                createdDish,
                ...this.dishList,
            ]);
        });
    }

    public updateDish(dishToUpdate: Dish): void {
        this.dishRestService.updateDish(dishToUpdate).subscribe((updatedDish: Dish) => {
            this.setDishList(
                this.dishList.map((dish: Dish): Dish =>
                    dish.id === updatedDish.id ? updatedDish : dish),
                );
        });
    }

    public deleteDish(dishIdToDelete: string): void {
        this.dishRestService.deleteDish(dishIdToDelete).subscribe((deletedDishId) => {
            this.setDishList(
                this.dishList.filter(
                    (dish: Dish): boolean => dish.id !== deletedDishId,
                ),
            );
        });
    }

    private setDishList(dishList: Dish[]): void {
        this.dishListSubject.next(<Dish[]> Object.freeze(dishList));
    }

}
