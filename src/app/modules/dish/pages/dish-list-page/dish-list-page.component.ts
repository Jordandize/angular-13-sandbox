import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from '../../models/server/dish.model';
import { CategoryStoreService } from '../../services/store/category-store.service';
import { DishStoreService } from '../../services/store/dish-store.service';

@Component({
    selector: 'app-dish-list-page',
    templateUrl: './dish-list-page.component.html',
    styleUrls: ['./dish-list-page.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishListPageComponent implements OnInit {

    constructor(private dishStoreService: DishStoreService,
                private categoryStoreService: CategoryStoreService,
                private cdr: ChangeDetectorRef) {
    }

    public dishList$: Observable<Dish[]>;
    public isDishPopoverVisible: boolean = false;
    public dishToUpdate: Dish;

    public ngOnInit(): void {
        this.dishStoreService.loadDishList();
        this.categoryStoreService.loadCategories();
        this.dishList$ = this.dishStoreService.getDishList();
    }

    public onCreateDishClick(): void {
        this.isDishPopoverVisible = true;
        this.cdr.markForCheck();
    }

    public onDishUpdateClick(dish: Dish): void {
        this.dishToUpdate = dish;
        this.isDishPopoverVisible = true;
        this.cdr.markForCheck();
    }

    public onDishDeleteClick(dish: Dish): void {
        this.dishStoreService.deleteDish(dish.id);
    }

    public trackById(index: number, dish: Dish): string {
        return dish.id;
    }

}
