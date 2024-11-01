import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ATTRIBUTE_FONT_SIZE, TABLE_BORDER_THICKNESS, TABLE_NAME_PADDING as SPACE_UNDER_TABLE_NAME, TABLE_ATTRIBUTE_PADDING, TABLE_NAME_FONT_SIZE, TABLE_PADDING } from '../../../../canvas/constants/canvas.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { McdTableService } from '../../../../domain/mcd/services/table/mcd-table.service';
import { DrawingService } from '../../../../canvas/services/drawing/drawing.service';
import { CartesianCoordinate } from '../../../../plan-systems/models/classes/cartesian-coordinate.class';
import { Rectangle } from '../../../../plan-systems/models/classes/rectangle.class';
import { TableWithCanvas } from '../../../../canvas/models/table-with-canvas.class';
import { McdTable } from '../../../../domain/mcd/models/mcd-table.class';
import { ArchimedeanSpiral } from '../../../../plan-systems/models/classes/archimedean-spiral.class';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.css', '../main.css']
})
export class MainCanvasComponent implements OnInit, AfterViewInit {
  private destroyRef: DestroyRef = inject(DestroyRef);
  tableService: McdTableService = inject(McdTableService);
  drawingService: DrawingService = inject(DrawingService);

  declare canvas: HTMLCanvasElement;
  declare context: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @ViewChild('mainFrame') mainFrame!: ElementRef;

  declare $draw: Observable<string>;

  ngOnInit(): void {
    this.$draw = this.drawingService.getDrawOrder();
    this.$draw.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(message => {
      if (message === "go") {
        this.drawSpiral();
      }
    })
  }

  ngAfterViewInit(): void {
    const width = this.mainFrame.nativeElement.offsetWidth;
    const height = this.mainFrame.nativeElement.offsetHeight;
    this.canvas = this.myCanvas.nativeElement;
    this.canvas.width = width - 2;
    this.canvas.height = height - 2;
    const context = this.canvas.getContext('2d');
    if (context) {
      this.context = context;
    }
  }

  #drawRectangle(ctx: CanvasRenderingContext2D, position: CartesianCoordinate, rectangle: Rectangle, color: string = "black") {
    ctx.fillStyle = color;
    ctx.fillRect(position.getX(), position.getY(), rectangle.getWidth(), rectangle.getHeight());
  }
  // ancienne version
  // #drawTables() {
  //   let position: Position = new Position(0, 0);
  //   for (const table of this.tableService.getTableList()) {
  //     this.context.drawImage(this.#drawTable(table), position.x, position.y);
  //   }
  // }

  #drawTables() {
    const tableList: TableWithCanvas[] = this.#getTableList();
  }


  #getTableList(): TableWithCanvas[] {
    const tableList: TableWithCanvas[] = [];
    let tables: McdTable[] = [];
    this.tableService.$getTableList().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (qqch) => tables = qqch
    );
    for (const table of tables) {
      tableList.push(new TableWithCanvas(table, this.#drawTable(table)));
    }
    return tableList;
  }

  #drawTable(table: McdTable): HTMLCanvasElement {
    const canvas = this.createCanvas(table);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = TABLE_NAME_FONT_SIZE + "px serif";
    let lineOnCanvas = TABLE_NAME_FONT_SIZE + TABLE_PADDING;
    let paddingLeft = TABLE_PADDING;
    ctx.fillStyle = 'black';
    ctx.fillText(table.name, paddingLeft, lineOnCanvas);
    lineOnCanvas += TABLE_NAME_FONT_SIZE + SPACE_UNDER_TABLE_NAME;
    ctx.font = ATTRIBUTE_FONT_SIZE + "px serif";
    for (let attribute of table.attributes) {
      ctx.fillText(attribute, paddingLeft, lineOnCanvas);
      lineOnCanvas += ATTRIBUTE_FONT_SIZE + TABLE_ATTRIBUTE_PADDING;
    }
    return canvas;

  }

  createCanvas(table: McdTable): HTMLCanvasElement {
    const rect = this.getTableSize(table);
    const canvas = document.createElement('canvas');
    canvas.width = rect.getWidth();
    canvas.height = rect.getHeight();
    this.#drawBorder(canvas);
    return canvas;
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

  getTableSize(table: McdTable): Rectangle {
    this.context.font = TABLE_NAME_FONT_SIZE + "px serif";
    const text = this.context.measureText(table.name);
    let width: number = text.width;
    this.context.font = ATTRIBUTE_FONT_SIZE + "px serif";
    for (const attribute of table.attributes) {
      const txt = this.context.measureText(attribute);
      if (width < txt.width) {
        width = txt.width;
      }
    }
    let height = ((ATTRIBUTE_FONT_SIZE + TABLE_ATTRIBUTE_PADDING) * table.attributes.length);
    height += TABLE_NAME_FONT_SIZE + SPACE_UNDER_TABLE_NAME;
    height += 2 * TABLE_PADDING;
    height += TABLE_BORDER_THICKNESS * 2;
    width += TABLE_BORDER_THICKNESS * 2;
    width += 2 * TABLE_PADDING;

    return new Rectangle(width, height);
  }

  calcBoxes() {
    const tables = this.#getTableList();
    const nbTables = tables.length;
    let nbBoxes: number = 1;
    const canvasRect = Rectangle.buildFromCanvas(this.canvas);
    let areas: Rectangle[] = [];
    let widthDivision: number = 0;
    let heightDivision: number = 0;
    while (nbTables > nbBoxes) {
      if (widthDivision > heightDivision) {
        heightDivision += 1;
      } else {
        widthDivision += 1;
      }
      nbBoxes = heightDivision * widthDivision;
    }

  }

  drawSpiral() {
    const average = this.#getTableList().reduce((acc, cur) => acc + cur.getSize().getWidth(), 0) / this.#getTableList().length;
    const nbTables: number = 13;
    const nbTableMaxPerTurn = 6;
    // const nbSpirals = Math.min(nbTableMaxPerTurn, nbTables);
    const nbSpirals = Math.max(nbTableMaxPerTurn, nbTables);
    const w = this.canvas.width;
    const h = this.canvas.height;
    const nbTurns = Math.ceil(nbTables / nbTableMaxPerTurn) + 1;
    const d = Math.min(w, h);
    const nbPointsByLoop = 1;

    const pointSize = 5;
    //const distanceBetweenLoops = d / (nbTables);
    const distanceBetweenLoops = average;
    const points: CartesianCoordinate[] = [];

    console.log(distanceBetweenLoops)

    for (let i = 0; i < nbSpirals; i += 1) {
      const spiral: ArchimedeanSpiral = new ArchimedeanSpiral(distanceBetweenLoops, nbPointsByLoop, nbTurns, i * 2 * Math.PI / nbSpirals);
      for (let point of spiral.getCartesianPoints()) {
        if (!point.isSame(new CartesianCoordinate(0, 0))) {
          const pointInCanvas = point.transformIntoCanvasCoordinate(new Rectangle(this.canvas.width, this.canvas.height));
          points.push(pointInCanvas);
        }
      }
    }
    console.log(points);

    if (nbTables > nbTableMaxPerTurn) {
      for (let i = 0; i < points.length; i += 1) {
        if (i % 4 == 0 || i % 4 == 3) {
          console.log("hop")
          const pointInCanvas = points[i];
          this.context.fillRect(pointInCanvas.getX(), pointInCanvas.getY(), pointSize, pointSize);
        }
      }
    } else {
      const choosenTables: number[] = [];
      switch (nbTables) {
        case 2:
          choosenTables.push(0, 3);
          break;
        case 3:
          choosenTables.push(0, 2, 4);
          break;
        case 4:
          choosenTables.push(1, 2, 4, 5);
          break;
        case 5:
          choosenTables.push(0, 1, 2, 3, 4);
          break;
        case 6:
          choosenTables.push(0, 1, 2, 3, 4, 5);
          break;

      }
      for (let i = 0; i < points.length; i += 1) {
        if (choosenTables.includes(i)) {
          const pointInCanvas = points[i];
          this.context.fillRect(pointInCanvas.getX(), pointInCanvas.getY(), pointSize, pointSize);
        }
      }

    }


    // if (i % Math.ceil(nbTables / nbTableMaxPerTurn) == 0) {
    //   const pointInCanvas = points[i];
    //   this.context.fillRect(pointInCanvas.x, pointInCanvas.y, pointSize, pointSize);
    // }



    //   const spiral: ArchimedeanSpiral = new ArchimedeanSpiral(distanceBetweenLoops, nbPointsByLoop, nbTurns, 6 * Math.PI / 4);
    //   console.log(spiral);
    //   for (let point of spiral.cartesianPoints) {
    //     const pointInCanvas = point.transformIntoCanvasCoordinate(new Rectangle(this.canvas.width, this.canvas.height));
    //     this.context.fillRect(pointInCanvas.x, pointInCanvas.y, pointSize, pointSize);
    //   }

    //   const inverseSpiral: ArchimedeanSpiral = new ArchimedeanSpiral(distanceBetweenLoops, nbPointsByLoop, nbTurns);
    //   this.context.fillStyle = "red";
    //   console.log(inverseSpiral);
    //   for (let point of inverseSpiral.cartesianPoints) {
    //     const pointInCanvas = point.transformIntoCanvasCoordinate(new Rectangle(this.canvas.width, this.canvas.height));
    //     this.context.fillRect(pointInCanvas.x, pointInCanvas.y, pointSize, pointSize);
    //   }

    //   const otherSpiral: ArchimedeanSpiral = new ArchimedeanSpiral(distanceBetweenLoops, nbPointsByLoop, nbTurns, 3 * Math.PI / 4);
    //   this.context.fillStyle = "green";
    //   console.log(otherSpiral);
    //   for (let point of otherSpiral.cartesianPoints) {
    //     const pointInCanvas = point.transformIntoCanvasCoordinate(new Rectangle(this.canvas.width, this.canvas.height));
    //     this.context.fillRect(pointInCanvas.x, pointInCanvas.y, pointSize, pointSize);
    //   }
  }
}
