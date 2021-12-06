import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DishForm } from '../../models/client/dish-form.model';
import {
    DishPopoverMode,
    dishPopoverModeMap,
} from '../../models/client/dish-popover.model';
import { Category } from '../../models/server/category.model';
import { Dish } from '../../models/server/dish.model';
import { DishFormService } from '../../services/client/dish-form.service';
import { DishService } from '../../services/client/dish.service';
import { CategoryStoreService } from '../../services/store/category-store.service';
import { DishStoreService } from '../../services/store/dish-store.service';
import { DishFormComponent } from '../dish-form/dish-form.component';

@Component({
    selector: 'app-dish-popover',
    templateUrl: './dish-popover.component.html',
    styleUrls: ['./dish-popover.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishPopoverComponent implements OnInit, OnChanges {

    constructor(private cdr: ChangeDetectorRef,
                private categoryStoreService: CategoryStoreService,
                private dishStoreService: DishStoreService,
                private dishService: DishService,
                private dishFormService: DishFormService) {
    }

    @ViewChild(DishFormComponent, { static: true })
    public dishFormRef: DishFormComponent;

    @Output()
    public visibleChange = new EventEmitter<boolean>();

    @Output()
    public dishToUpdateChange = new EventEmitter<Dish>();

    @Input()
    public set visible(visible: boolean) {
        this.setVisible(visible);
    };

    public get visible(): boolean {
        return this.visibleInner;
    }

    @Input()
    public dishToUpdate: Dish;

    public categories$: Observable<Category[]>;
    public mode: DishPopoverMode = dishPopoverModeMap.create;

    private visibleInner: boolean = false;

    public ngOnInit(): void {
        this.categories$ = this.categoryStoreService.getCategories();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dishToUpdate) {
            if (this.dishToUpdate) {
                this.mode = dishPopoverModeMap.update;
                const dishForm: DishForm = this.dishFormService
                    .fromDish(this.dishToUpdate);
                this.dishFormRef.reset(dishForm);
            } else {
                this.mode = dishPopoverModeMap.create;
                this.dishFormRef.reset();
            }
        }
    }

    public onSubmitClick(): void {
        if (this.dishFormRef.form.valid) {
            const dishForm: DishForm = this.dishFormRef.value;
            const dish: Dish = this.dishService.fromDishForm(dishForm);
            if (this.mode.type === "create") {
                this.createDish(dish);
            } else if (this.mode.type === "update") {
                this.updateDish({
                    ...dish,
                    id: this.dishToUpdate.id,
                });
            }
        } else {
            this.dishFormRef.showErrors();
        }
    }

    public close(): void {
        this.setVisible(false);
    }

    private createDish(dish: Dish): void {
        this.dishStoreService.createDish(dish);
        this.close();
    }

    private updateDish(dish: Dish): void {
        this.dishStoreService.updateDish(dish);
        this.close();
    }

    private setVisible(visible: boolean): void {
        this.visibleInner = visible;
        if (!this.visible) {
            // Reset fields on popover close
            this.reset();
        }
        this.visibleChange.emit(this.visible);
        this.cdr.markForCheck();
    }

    private reset(): void {
        this.dishFormRef.reset();
        this.dishToUpdate = null;
        this.dishToUpdateChange.emit(this.dishToUpdate);
    }

}
