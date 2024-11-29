import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { McdTableService } from '../../../../domain/mcd/services/table/mcd-table.service';
import { DrawingCommandService } from '../../../../canvas/services/drawing-command/drawing-command.service';
import { Rectangle } from '../../../../plan-systems/models/classes/rectangle.class';
import { TableWithCanvas } from '../../../../canvas/models/table-with-canvas.class';
import { McdTable } from '../../../../domain/mcd/models/mcd-table.class';
import { CanvasDrawingService } from 'src/app/canvas/services/canvas-drawing/canvas-drawing.service';

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
  commandService: DrawingCommandService = inject(DrawingCommandService);
  drawingService: CanvasDrawingService = inject(CanvasDrawingService);

  declare canvas: HTMLCanvasElement;
  declare context: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @ViewChild('mainFrame') mainFrame!: ElementRef;


  ngOnInit(): void {
    this.#takeOrder();
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

  #takeOrder(): void {
    let $draw: Observable<string> = this.commandService.getDrawOrder();
    $draw.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(message => this.#doOrder(message));
  }

  #doOrder(message: string): void {
    console.log("message")
    switch (message) {
      case 'draw':
        this.#drawTables();
        break;
      case 'clear':
        this.#clear();
        break;
      default:
        break;
    }
  }

  #clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }



  #drawTables() {
    this.#clear();
    const tables = this.#getMcdTableList();
    const canvasRect = Rectangle.buildFromCanvas(this.canvas);

    let widthDivision: number;
    let heightDivision: number;
    [widthDivision, heightDivision] = [...this.calcSubdivision()];

    const widthFrame = canvasRect.getWidth();
    const heightFrame = canvasRect.getHeight();

    let height = heightFrame / heightDivision;
    let width = widthFrame / widthDivision;
    let indexX = 0;
    let indexY = 0;

    for (let table of tables) {
      let canvas = this.drawingService.drawTable(table);
      let x = width * indexX;
      let y = height * indexY;

      x = x + canvas.width / 2;
      y = y + canvas.height / 2;

      this.copyCanvasTableOnMainCanvas(canvas, x, y);
      indexX = this.incrementXorY(indexX, widthDivision);
      if (indexX == 0) {
        indexY = this.incrementXorY(indexY, heightDivision);
      }
    }
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
      tableList.push(new TableWithCanvas(table, this.drawingService.drawTable(table)));
    }
    return tableList;
  }

  #getMcdTableList() {
    let tables: McdTable[] = [];
    this.tableService.$getTableList().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (qqch) => tables = qqch
    );
    return tables;
  }

  calcSubdivision(): [number, number] {
    const tables = this.#getMcdTableList();
    const nbTables = tables.length;
    let nbBoxes: number = 1;
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

    return [widthDivision, heightDivision];
  }

  incrementXorY(x: number, xmax: number): number {
    return ++x >= xmax ? 0 : x;
  }

  copyCanvasTableOnMainCanvas(canvasTable: HTMLCanvasElement, x: number, y: number) {
    console.log(x, y);
    this.context.drawImage(canvasTable, x, y);
  }
}