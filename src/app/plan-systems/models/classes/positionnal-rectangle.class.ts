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

    getWidth(): number {
        return this.rect.getWidth();
    }

    getHeight(): number {
        return this.rect.getHeight();
    }

    getX(): number {
        return this.point.getX();
    }

    getY(): number {
        return this.point.getY();
    }

    getXLimit(): number {
        return this.getX() + this.getWidth();
    }

    getYLimit(): number {
        return this.getY() + this.getHeight();
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
        const thisBottomRight = this.getBottomRightPoint();
        const anotherBottomRight = anotherPositionnalRectangle.getBottomRightPoint();
        if (this.getPoint().getX() > anotherBottomRight.getX()
            || anotherPositionnalRectangle.getPoint().getX() > thisBottomRight.getX())
            return false;
        if (this.getPoint().getY() > anotherBottomRight.getY()
            || anotherPositionnalRectangle.getPoint().getY() > thisBottomRight.getY())
            return false;
        return true;
    }

    protected getBottomRightPoint(): CartesianCoordinate {
        const x = this.getX() + this.getWidth();
        const y = this.getY() + this.getHeight();
        return new CartesianCoordinate(x, y);
    }

    divideInRects(numberParts: number): PositionnalRectangle[] {
        return this.rect.divideInRects(numberParts, this.getX(), this.getY());
    }
}