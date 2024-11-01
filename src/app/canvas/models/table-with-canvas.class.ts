import { McdTable } from "../../domain/mcd/models/mcd-table.class";
import { CartesianCoordinate } from "../../plan-systems/models/classes/cartesian-coordinate.class";
import { Rectangle } from "../../plan-systems/models/classes/rectangle.class";

export class TableWithCanvas {
    declare position: CartesianCoordinate;
    constructor(
        private table: McdTable,
        private canvas: HTMLCanvasElement) { }

    getSize(): Rectangle {
        return new Rectangle(this.canvas.width, this.canvas.height);
    }

    setPosition(position: CartesianCoordinate) {
        this.position = position;
    }
}