import { Errors } from "../util";

abstract class CrudRepository<T, ID> {
    abstract findAll(): Promise<T[]>;
    abstract findById(id: ID): Promise<T>;
    abstract save(entity: T): Promise<void>;
    abstract deleteById(id: ID): Promise<void>;
}

export type LocationID = string;

export interface Location {
    id: LocationID;
    lat: number;
    lng: number;
}

export abstract class LocationRepository extends CrudRepository<
    Location,
    LocationID
> {}

export class InMemoryLocationRepository extends LocationRepository {
    private readonly locations: Map<LocationID, Location> = new Map();

    findAll(): Promise<Location[]> {
        const entities = Array.from(this.locations.values());
        return Promise.resolve(entities);
    }

    findById(id: LocationID): Promise<Location> {
        if (this.locations.has(id)) {
            return Promise.resolve(this.locations.get(id)!);
        } else {
            return Promise.reject(Errors.ENTITY_NOT_FOUND);
        }
    }

    save(entity: Location): Promise<void> {
        this.locations.set(entity.id, entity);
        return Promise.resolve();
    }

    deleteById(id: LocationID): Promise<void> {
        const deleted = this.locations.delete(id);
        if (deleted) {
            return Promise.resolve();
        } else {
            return Promise.reject(Errors.ENTITY_NOT_FOUND);
        }
    }
}
