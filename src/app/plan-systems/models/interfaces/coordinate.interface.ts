export interface Coordinate<T> {
    isSame(point: T): boolean;
    distanceTo(point: T): number;
}