import { NumberOfCut } from "../types/number-of-cut.type";
import { CartesianCoordinate } from "./cartesian-coordinate.class";
import { PositionnalRectangle } from "./positionnal-rectangle.class";

export class Rectangle {
    public static buildFromCanvas(canvas: HTMLCanvasElement): Rectangle {
        return new Rectangle(canvas.width, canvas.height);
    }

    constructor(
        private width: number,
        private height: number) { }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }

    getCenter(): CartesianCoordinate {
        return new CartesianCoordinate(this.width / 2, this.height / 2);
    }

    isSame(rect: Rectangle): boolean {
        return this.height === rect.height && this.width === rect.width;
    }

    calcDivideInParts(numberParts: number): NumberOfCut {
        const n = Math.sqrt(numberParts) - 1;
        const h = Math.ceil(n);
        let v;
        n === h ? v = h : v = h - 1;
        return {
            horizontally: h,
            vertically: v
        };
    }

    divideInRects(numberParts: number, xStart: number = 0, yStart: number = 0): PositionnalRectangle[] {
        const parts = [];
        const numberOfCut: NumberOfCut = this.calcDivideInParts(numberParts);
        const width = this.width / (numberOfCut.horizontally + 1);
        const height = this.height / (numberOfCut.vertically + 1);
        for (let x = 0; x <= numberOfCut.horizontally; x += 1) {
            for (let y = 0; y <= numberOfCut.vertically; y += 1) {
                const position = new CartesianCoordinate(x * width + xStart, y * height + yStart);
                const rect = new PositionnalRectangle(position, new Rectangle(width, height));
                parts.push(rect);
            }
        }
        return parts;
    }
}