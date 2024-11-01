import { CartesianCoordinate } from "./cartesian-coordinate.class";

export class Rectangle {
    public static buildFromCanvas(canvas: HTMLCanvasElement): Rectangle {
        return new Rectangle(canvas.width, canvas.height);
    }

    constructor(
        public width: number,
        public height: number) { }

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
}