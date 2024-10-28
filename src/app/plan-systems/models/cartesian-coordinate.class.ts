import { Rectangle } from "./rectangle.class";
import { PolarCoordinate } from "./polar-coordinate.class";

export class CartesianCoordinate {
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
    transformIntoCanvasCoordinate(canvasRect: Rectangle) {
        let originX = Math.round(canvasRect.width / 2);
        let originY = Math.round(canvasRect.height / 2);

        return new CartesianCoordinate(this.x + originX, this.y + originY);
    }

    isSame(point: CartesianCoordinate) {
        return this.x === point.x && this.y === point.y;
    }
}