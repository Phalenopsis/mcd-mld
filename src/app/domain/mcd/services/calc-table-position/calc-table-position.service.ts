import { Injectable } from '@angular/core';
import { Rectangle } from '../../../../plan-systems/models/classes/rectangle.class';
import { TableWithCanvas } from '../../../../canvas/models/table-with-canvas.class';
import { CartesianCoordinate } from '../../../../plan-systems/models/classes/cartesian-coordinate.class';


@Injectable({
  providedIn: 'root'
})
export class CalcTablePositionService {

  constructor() { }

  findTablesPosition(canvasSize: Rectangle, tableList: TableWithCanvas[]): TableWithCanvas[] {

    switch (tableList.length) {
      case 2:
        this.findPositionIfTablesAreTwo(canvasSize, tableList);
        break;
      default:
        throw new Error("this case is not yet implemented");
    }

    return tableList;
  }

  findPositionIfTablesAreTwo(canvasSize: Rectangle, tableList: TableWithCanvas[]): CartesianCoordinate[] {
    const rectList = tableList.map(table => table.getSize());
    const totalOccupedWidth = rectList.reduce((acc: number, curr: Rectangle) => acc + curr.getWidth(), 0);
    const totalFreeWidth = canvasSize.getWidth() - totalOccupedWidth;
    const position1x = Math.round(totalFreeWidth / 3);
    const position2x = position1x * 2 + rectList[0].getWidth();
    const position1y = Math.round((canvasSize.getHeight() - rectList[0].getHeight()) / 2);
    const position2y = Math.round((canvasSize.getHeight() - rectList[1].getHeight()) / 2);
    const position1: CartesianCoordinate = new CartesianCoordinate(position1x, position1y);
    const position2: CartesianCoordinate = new CartesianCoordinate(position2x, position2y);
    return [position1, position2];
  }
}
