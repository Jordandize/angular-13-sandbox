export interface DishForm {
    name: string;
    category: string;
    tags: string[];
}

export const initDishForm: DishForm = Object.freeze({
    name: "",
    category: null,
    tags: [],
});
