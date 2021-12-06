import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import {
    map,
    shareReplay,
} from 'rxjs/operators';
import { Category } from '../../models/server/category.model';
import { CategoryRestService } from '../server/category-rest.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryStoreService {

    constructor(private categoryRestService: CategoryRestService) { }

    private categoriesSubject = new BehaviorSubject<Category[]>([]);
    private categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
    private categoriesMap$: Observable<Record<string, Category>> = this.resolveCategoriesMap();

    public loadCategories(): void {
        this.categoryRestService.getCategories()
            .subscribe((categories: Category[]) => {
                this.setCategories(categories);
            });
    }

    public getCategories(): Observable<Category[]> {
        return this.categories$;
    }

    public getCategoriesMap(): Observable<Record<string, Category>> {
        return this.categoriesMap$;
    }

    private setCategories(categories: Category[]): void {
        this.categoriesSubject.next(<Category[]> Object.freeze(categories));
    }

    private resolveCategoriesMap(): Observable<Record<string, Category>> {
        return this.categories$.pipe(
            map((categories: Category[]) =>
                categories.reduce((acc, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                }, { } as Record<string, Category>),
            ),
            // Do not recalculate on every new subscription
            shareReplay(),
        );
    }

}
