import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DishCard } from '../../models/client/dish-card.model';
import { Dish } from '../../models/server/dish.model';
import { DishCardService } from '../../services/client/dish-card.service';

@Component({
    selector: 'app-dish-card',
    templateUrl: './dish-card.component.html',
    styleUrls: ['./dish-card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishCardComponent implements OnInit, OnChanges {

    constructor(private dishCardService: DishCardService) {
    }

    @Output()
    public updateClick = new EventEmitter<Dish>();

    @Output()
    public deleteClick = new EventEmitter<Dish>();

    @Input()
    public dish: Dish;

    public dishCard$: Observable<DishCard>;

    private dishSubject = new BehaviorSubject<Dish>(null);

    public ngOnInit(): void {
        this.dishCard$ = this.dishSubject.pipe(
            switchMap(this.dishCardService.fromDish),
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dish) {
            this.dishSubject.next(this.dish);
        }
    }

}
