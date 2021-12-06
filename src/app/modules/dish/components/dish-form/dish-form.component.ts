import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    DishForm,
    initDishForm,
} from '../../models/client/dish-form.model';
import { Category } from '../../models/server/category.model';

@Component({
    selector: 'app-dish-form',
    templateUrl: './dish-form.component.html',
    styleUrls: ['./dish-form.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishFormComponent {

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef) {
    }

    @Input()
    public categories: Category[];

    public form: FormGroup = this.buildForm();

    public get value(): DishForm {
        return this.form.value;
    }

    public get controls(): Record<keyof DishForm, AbstractControl> {
        return this.form.controls as Record<keyof DishForm, AbstractControl>;
    }

    public reset(value: DishForm = initDishForm): void {
        this.form.reset(value);
    }

    public showErrors(): void {
        this.form.markAllAsTouched();
        this.cdr.markForCheck();
    }

    private buildForm(): FormGroup {
        const { name, category, tags } = initDishForm;
        const controls: Record<keyof DishForm, unknown> = {
            name: [name, Validators.required],
            category: [category, Validators.required],
            tags: [tags],
        };
        return this.fb.group(controls);
    }

}
