import { Injectable } from '@angular/core';
import { CartesianCoordinate } from '@plan/models/classes/cartesian-coordinate.class';
import { Rectangle } from '@plan/models/classes/rectangle.class';
import { ATTRIBUTE_FONT_SIZE, TABLE_ATTRIBUTE_PADDING, TABLE_BORDER_THICKNESS, TABLE_NAME_FONT_SIZE, TABLE_NAME_PADDING, TABLE_PADDING } from '../../constants/canvas.constant';
import { McdTable } from 'src/app/domain/mcd/models/mcd-table.class';

@Injectable({
  providedIn: 'root'
})
export class CanvasDrawingService {

  constructor() { }

  drawTable(table: McdTable): HTMLCanvasElement {
    const canvas = this.#createCanvas(table);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = TABLE_NAME_FONT_SIZE + "px serif";
    let lineOnCanvas = TABLE_NAME_FONT_SIZE + TABLE_PADDING;
    let paddingLeft = TABLE_PADDING;
    ctx.fillStyle = 'black';
    ctx.fillText(table.name, paddingLeft, lineOnCanvas);
    lineOnCanvas += TABLE_NAME_FONT_SIZE + TABLE_NAME_PADDING;
    ctx.font = ATTRIBUTE_FONT_SIZE + "px serif";
    for (let attribute of table.attributes) {
      ctx.fillText(attribute, paddingLeft, lineOnCanvas);
      lineOnCanvas += ATTRIBUTE_FONT_SIZE + TABLE_ATTRIBUTE_PADDING;
    }
    return canvas;
  }

  #drawRectangle(ctx: CanvasRenderingContext2D, position: CartesianCoordinate, rectangle: Rectangle, color: string = "black") {
    ctx.fillStyle = color;
    ctx.fillRect(position.getX(), position.getY(), rectangle.getWidth(), rectangle.getHeight());
  }

  #drawBorder(canvas: HTMLCanvasElement, color: string = "#000") {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const position: CartesianCoordinate = new CartesianCoordinate(
      TABLE_BORDER_THICKNESS, TABLE_BORDER_THICKNESS
    );
    const rect: Rectangle = new Rectangle(
      canvas.width - 2 * TABLE_BORDER_THICKNESS,
      canvas.height - 2 * TABLE_BORDER_THICKNESS
    )
    this.#drawRectangle(ctx, position, rect, "white");
  }

  #createCanvas(table: McdTable): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = this.#getTableSize(ctx, table);
      canvas.width = rect.getWidth();
      canvas.height = rect.getHeight();
    }
    this.#drawBorder(canvas);
    return canvas;
  }

  #getTableSize(context: CanvasRenderingContext2D, table: McdTable): Rectangle {
    context.font = TABLE_NAME_FONT_SIZE + "px serif";
    const text = context.measureText(table.name);
    let width: number = text.width;
    context.font = ATTRIBUTE_FONT_SIZE + "px serif";
    for (const attribute of table.attributes) {
      const txt = context.measureText(attribute);
      if (width < txt.width) {
        width = txt.width;
      }
    }
    let height = ((ATTRIBUTE_FONT_SIZE + TABLE_ATTRIBUTE_PADDING) * table.attributes.length);
    height += TABLE_NAME_FONT_SIZE + TABLE_NAME_PADDING;
    height += 2 * TABLE_PADDING;
    height += TABLE_BORDER_THICKNESS * 2;
    width += TABLE_BORDER_THICKNESS * 2;
    width += 2 * TABLE_PADDING;

    return new Rectangle(width, height);
  }
}
