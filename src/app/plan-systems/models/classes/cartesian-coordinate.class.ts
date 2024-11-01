import { Rectangle } from "./rectangle.class";
import { PolarCoordinate } from "./polar-coordinate.class";
import { MINIMUM_ACCEPTABLE_DIFFERENCE } from "../../constants/constants.constant";
import { Coordinate } from "../interfaces/coordinate.interface";

export class CartesianCoordinate implements Coordinate<CartesianCoordinate> {
    constructor(
        public x: number,
        public y: number
    ) { }

    toPolar(): PolarCoordinate {
        let radius = (this.x ** 2 + this.y ** 2) ** 0.5;
        let angle = Math.atan2(this.y, this.x);

        return new PolarCoordinate(radius, angle, false);
    }

    /**
     * Assume that plan origin is canvas's center.
     * 
     * @param canvasRect  a Rectangle with canvas's width and height
     * @returns CartesianCoordinate
     */
    transformIntoCanvasCoordinate(canvasRect: Rectangle): CartesianCoordinate {
        let originX = Math.round(canvasRect.width / 2);
        let originY = Math.round(canvasRect.height / 2);

        return new CartesianCoordinate(this.x + originX, this.y + originY);
    }

    isSame(point: CartesianCoordinate): boolean {
        return Math.abs(this.x - point.x) <= MINIMUM_ACCEPTABLE_DIFFERENCE
            && Math.abs(this.y - point.y) <= MINIMUM_ACCEPTABLE_DIFFERENCE;
    }

    distanceTo(point: CartesianCoordinate): number {
        return ((this.x + point.x) ** 2 + (this.y + point.y) ** 2) ** 0.5;
    }
}