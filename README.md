# Задача

Реалізувати набір CRUD  (створити, переглянути, змінити, видалити) операцій для DM.

План роботи:
1. Створюємо структуру.
2. Описуємо дані.
3. Додаємо компоненти.
4. Організовуємо роботу з даними (`*-rest.service.ts`, `*-store.service.ts`).
5. Форма створення та редагування

# 1. Створюємо структуру
Спочатку створемо модуль* за допомогою Angular CLI:
```
ng g m modules/dish --routing
```
Інші папки додамо вручну. Має вийти щось типу цього:
```
src 
  ↳ modules
      ↳ dish
            components
            pages
            models
              ↳ client
                server
            services
              ↳ client
                rest
                store
            dish-routing.module.ts
            dish.module.ts
```
\* Додайте модуль `dish.module.ts`, якщо ви уже знайомі з [модульною системою Angular ](https://angular.io/guide/architecture-modules). Дану частину можна скіпнути, але у такому випадку всі компоненти будуть додаватися за замовченням до корньового модуля `AppModule` (це не дуже, тому не рекомендую - краще розібратися з модулями).

# 2. Описуємо дані
Дещо спростимо відображення - додамо лише ID, ім'я, посилання на категорію та теги:
> modules/dish/models/server/dish.model.ts
```ts
export interface Dish {
    id: string;
    name: string;
    categoryId: string;
    tags: string[];
}
```
Категорія:
> modules/dish/models/server/category.model.ts
```ts
export interface Category {
    id: string;
    name: string;
}
```

# 3. Додаємо компоненти

## 3.1 Створюємо сторінку
Сторінковий компонент (`*-page.component.ts`) - це Angular компонент, який містить основний контент, що відображається у вікні браузера. Можна сказати, що це певного типу конструктор: збираючи різні компоненти - ми отримуємо сторінку.

Створемо сторінку для страв, на якій ми зможемо переглянути їх, створити нову страву, редагувати її та видалити:
```
ng g c modules/dish/pages/dish-list-page
```
Та зробимо її доступною для користувача за посиланням `http://localhost:4200/dish/list`, [додавши](https://angular.io/guide/lazy-loading-ngmodules) даний компонент до роута:
> dish-routing.module.ts
```ts
const routes: Routes = [
    {
        path: "list",
        component: DishListPageComponent,
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    }
];
```
> app-routing.module.ts
```ts
const routes: Routes = [
    {
        path: "dish",
        loadChildren: () => import("./modules/dish/dish.module").then((m) => m.DishModule),
    }
];
```

## 3.2 Створюємо список страв

Спершу ознайомлюємся з **[БЕМ](https://ru.bem.info/methodology/quick-start/])**. Якщо коротко, то:

* сам компонент (`<app-dish-list-page/>`) - це блок;
* все що в середені - це елемент (форма, кнопка, таблиця, дів тощо). Навіть інший компонент всередині другого становиться елементом (наприклад, `<app-dish-form/>` всередині `<app-dish-list-page/>`), хоча вне контексту він є блоком;
* стилі, які змінюють зовнішній вигляд елемента в залежності від стана компонента - модифікатори. Наприклад, `class="dish-form__input _error"` - тут класс `_error` є модифікатором, який змінює колір бордера в інпуті на червоний (додати класс динамічно - [NgClass](https://angular.io/api/common/NgClass));

Аби трохи розділити логіку, додамо новий компонент, який буде відповідати за відображення страви у списку:
```
ng g c modules/dish/components/dish-card
```
Тепер перейдемо до самого списку. Опишемо розмітку:
> dish-list-page.component.html
```html
<button class="dish-list-page__create-button" ... >
    Create Dish
</button>
<div class="dish-list-page__dish-card-list">
    <app-dish-card
        *ngFor="let dish of dishList$ | async; trackBy: trackById"
        class="dish-list-page__dish-card"
        ...
    ></app-dish-card>
</div>
...
```

CSS:
> dish-list-page.component.less
```less
:host {
  display: flex;
  flex-direction: column;
}

.dish-list-page {
  &__create-button { ... }

  &__dish-card-list { ... }
}
```
та TS:
> dish-list-page.component.ts
```ts
@Component({ ... })
export class DishListPageComponent {
    public dishList$: Observable<Dish[]>;

    public onCreateDishClick(): void { }

    public onDishUpdateClick(dish: Dish): void { }

    public onDishDeleteClick(dish: Dish): void { }

    public trackById(index: number, dish: Dish): string {
        return dish.id;
    }
}
```

# 4. Організовуємо роботу з даними
Популярним рішенням для роботи з даними на FE є Redux ([NgRx](https://ngrx.io/guide/store)). Проте, щоб спростити завдання, ми будемо використовувати звичайні сервіси Angular та [RxJS](https://www.learnrxjs.io/).

Спочатку створимо REST сервіс:

> modules/dish/sercices/server/dish-rest.service
```ts
export class DishRestService {

    constructor(private http: HttpClient) { }

    public getDishList(): Observable<Dish[]> { ... }

    ...
}
```

Тепер додамо Store сервіс, у якому ми будемо централізовано зберігати дані страв (наприклад, список страв). Також зробимо їх `immutable` за допомогою `Object.freeze()`, щоб ніхто випадково не змінив дані під час роботи з ними. Міняти дані можна лише через інтерфейс Store сервіса.

> modules/dish/sercices/server/dish-store.service
```ts
export class DishStoreService {

    constructor(private dishRestService: DishRestService) { }

    private dishListSubject = new BehaviorSubject<Dish[]>([]);
    private dishList$ = this.dishListSubject.asObservable();

    public loadDishList(): void {
        this.dishRestService.getDishList().subscribe((dishList: Dish[]) => {
            this.setDishList(dishList);
        });
    }

    public getDishList(): Observable<Dish[]> {
        return this.dishList$;
    }

    private setDishList(dishList: Dish[]): void {
        this.dishListSubject.next(<Dish[]> Object.freeze(dishList));
    }
    
}
```

Додамо Store сервіс до нашого `dish-list-page.component.ts` компоненту:

>   dish-list-page.component.ts
```ts
export class DishListPageComponent implements OnInit {

    constructor(private dishStoreService: DishStoreService) { }

    public dishList$: Observable<Dish[]>;

    public ngOnInit(): void {
        this.dishStoreService.loadDishList();
        this.dishList$ = this.dishStoreService.getDishList();
    }
    
    ...
}
```
`ngOnInit` - майже завжди найкраще місце для ініціалізації даних.

`loadDishList()` - викликаємо один раз на сторінці, якщо безпосередньо їй, або будь-якому вкладеному компоненту сторінки необхідний список страв. Так ми можемо бути впевнені, що кожного разу, коли користувач потрапляє за адресом `/dish/list`, буде гарантовано відправлено запит на отримання списку страв. Щоб "перезавантажити" список (наприклад, по кнопці "Refresh"), можемо просто повторно викликати `loadDishList()` метод і все - UI відображення оновиться відповідно до нового списку.

`getDishList()` - викликаєм будь-скільки раз у будь-якому місці - це просто "геттер".

# 5. Форма створення та редагування

TODO додати README

ReactiveFormsModule
npm i @ngrx/component
ReactiveComponentModule
```
ng g c modules/dish/components/dish-form
```

