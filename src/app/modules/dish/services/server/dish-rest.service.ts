import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
    Observable,
    of,
} from 'rxjs';
import { Dish } from '../../models/server/dish.model';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DishRestService {

    constructor(private http: HttpClient) { }

    public getDishList(): Observable<Dish[]> {
        /* Emulate API call */
        return of(dishList).pipe(
            delay(300),
        );
    }

    public createDish(dish: Dish): Observable<Dish> {
        /* Emulate API call */
        return of({
            ...dish,
            id: new Date().toDateString(), // Assign unique ID
        }).pipe(
            delay(300),
        );;
    }

    public updateDish(dish: Dish): Observable<Dish> {
        /* Emulate API call */
        return of(dish).pipe(
            delay(300),
        );;
    }

    public deleteDish(dishId: string): Observable<string> {
        /* Emulate API call */
        return of(dishId).pipe(
            delay(300),
        );;
    }

}

const dishList: Dish[] = [
    {
        id: "1",
        name: "Dish A",
        categoryId: "1",
        tags: ["Tag A"],
    },
    {
        id: "2",
        name: "Dish B",
        categoryId: "2",
        tags: ["Tag A", "Tag B"],
    },
    {
        id: "3",
        name: "Dish C",
        categoryId: "3",
        tags: ["Tag B"],
    },
    {
        id: "4",
        name: "Dish D",
        categoryId: "4",
        tags: ["Tag C"],
    },
    {
        id: "5",
        name: "Dish E",
        categoryId: "1",
        tags: ["Tag D", "Tag E"],
    },
    {
        id: "6",
        name: "Dish F",
        categoryId: "2",
        tags: ["Tag A"],
    },
    {
        id: "7",
        name: "Dish G",
        categoryId: "3",
        tags: ["Tag A"],
    },
];
