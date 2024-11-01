import { Coordinate } from "../interfaces/coordinate.interface";
import { CartesianCoordinate } from "./cartesian-coordinate.class";
import { Rectangle } from "./rectangle.class";

/**
 * 
 * @param rect : rectangle's size
 * @param point: CartesianCoordinate rectangle's top-left coordinate
 */
export class PositionnalRectangle implements Coordinate<PositionnalRectangle> {
    constructor(private point: CartesianCoordinate, private rect: Rectangle) {
    }

    getRect(): Rectangle {
        return this.rect;
    }

    /**
     * 
     * @returns top-left coordinate
     */
    getPoint(): CartesianCoordinate {
        return this.point;
    }

    isSame(anotherPositionnalRectangle: PositionnalRectangle): boolean {
        return this.point.isSame(anotherPositionnalRectangle.getPoint())
            && this.rect.isSame(anotherPositionnalRectangle.getRect());
    }

    /**
     * 
     * @returns distance between each top-left coordinate
     */
    distanceTo(anotherPositionnalRectangle: PositionnalRectangle): number {
        return this.point.distanceTo(anotherPositionnalRectangle.getPoint());
    }

    isOverlap(anotherPositionnalRectangle: PositionnalRectangle): boolean {
        const thisBottomRight = this.#getBottomRightPoint();
        const anotherBottomRight = anotherPositionnalRectangle.#getBottomRightPoint();
        if (this.getPoint().getX() > anotherBottomRight.getX()
            || anotherPositionnalRectangle.getPoint().getX() > thisBottomRight.getX())
            return false;
        if (this.getPoint().getY() > anotherBottomRight.getY()
            || anotherPositionnalRectangle.getPoint().getY() > thisBottomRight.getY())
            return false;
        return true;
    }

    #getBottomRightPoint(): CartesianCoordinate {
        const x = this.getPoint().getX() + this.getRect().getWidth();
        const y = this.getPoint().getY() + this.getRect().getHeight();
        return new CartesianCoordinate(x, y);
    }
}