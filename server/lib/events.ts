import { Location, LocationID } from "./management/repository";
import { ValidationErrorItem } from "joi";

interface Error {
    error: string;
    errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
    data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
    "location:created": (location: Location) => void;
    // "todo:updated": (todo: Todo) => void;
    // "todo:deleted": (id: TodoID) => void;
}

export interface ClientEvents {
    "location:list": (callback: (res: Response<Location[]>) => void) => void;

    "location:create": (
        payload: Omit<Location, "id">,
        callback: (res: Response<LocationID>) => void
    ) => void;

    "location:read": (
        id: LocationID,
        callback: (res: Response<Location>) => void
    ) => void;

    // "todo:update": (
    //     payload: Todo,
    //     callback: (res?: Response<void>) => void
    // ) => void;

    // "todo:delete": (
    //     id: TodoID,
    //     callback: (res?: Response<void>) => void
    // ) => void;
}
