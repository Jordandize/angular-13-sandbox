export interface DishPopoverMode {
    type: DishPopoverModeType;
    title: string;
    submitText: string;
}

export type DishPopoverModeType =
    | "create"
    | "update";

export const dishPopoverModeMap: Record<DishPopoverModeType, DishPopoverMode> = Object.freeze({
    create: {
        type: "create",
        title: "Create Dish",
        submitText: "Create",
    },
    update: {
        type: "update",
        title: "Update Dish",
        submitText: "Save Changes",
    },
});
