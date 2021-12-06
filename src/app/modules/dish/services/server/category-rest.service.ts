import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../../models/server/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryRestService {

    constructor(private http: HttpClient) { }

    public getCategories(): Observable<Category[]> {
        // Emulate REST call
        return of(categories);
    }

}

const categories: Category[] = [
    {
        id: "1",
        name: "Category A",
    },
    {
        id: "2",
        name: "Category B",
    },
    {
        id: "3",
        name: "Category C",
    },
    {
        id: "4",
        name: "Category D",
    },
    {
        id: "5",
        name: "Category E",
    },
];
