import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Step } from '../models/step.type';
import { FlowCodeService } from '../services/flow-code.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Action } from '../models/action.type';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit {
  declare canvas: HTMLCanvasElement;
  declare context: CanvasRenderingContext2D;
  steps$ = inject(FlowCodeService).getSteps$();
  steps: Step[] = [];
  actions$ = inject(FlowCodeService).getActions$();
  actions: Action[] = [];
  destroyRef = inject(DestroyRef);
  stepsVerification = new Map<string, number>();

  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @ViewChild('mainFrame') mainFrame!: ElementRef;

  counter: number = 0;

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
    this.resetCanvas();

    this.steps$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((steps: Step[]) => this.setSteps(steps));

    this.actions$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((actions: Action[]) => this.setActions(actions))
  }

  setSteps(steps: Step[]) {
    this.steps = steps;
    this.draw();
  }

  setActions(actions: Action[]) {
    this.actions = actions;
    this.draw();
  }

  draw() {
    this.stepsVerification = new Map<string, number>();
    this.drawSteps();
    this.drawActions();
  }

  resetCanvas() {
    let color = 'white';
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSteps() {
    this.resetCanvas();
    const nbSteps = this.steps.length;
    if (nbSteps == 0) return;
    const distBetweenSteps = this.canvas.width / (nbSteps + 1);
    let x = 0;
    let y = 0;
    for (let step of this.steps) {
      x += distBetweenSteps;
      this.stepsVerification.set(step.name, x);
      this.drawStep(step, x);
    }
  }

  drawStep(step: Step, x: number) {
    const canvas = document.createElement("canvas");
    canvas.height = 100;
    canvas.width = 100;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    switch (step.type) {
      case "subject":
        const circle = this.createCircle(50);
        ctx.drawImage(circle, 25, 0);
        break;
      case "machine":
        const rect = this.createRectangle(50, 50);
        ctx.drawImage(rect, 25, 0);
        break;
      default:
        break;
    }
    this.write(step.name, canvas, 75);
    this.context.drawImage(canvas, x, 25);
    this.drawDescLine(x);
  }

  createCircle(radius: number) {
    const canvas = document.createElement("canvas");
    canvas.height = radius;
    canvas.width = radius;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(radius / 2, radius / 2, radius / 2, 0, 2 * Math.PI);
    ctx.stroke();
    return canvas;
  }

  drawDescLine(x: number) {
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.moveTo(x + 50, 125);
    this.context.lineTo(x + 50, this.canvas.width - 50);
    this.context.stroke();
  }

  createRectangle(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    return canvas;
  }

  createArrow(width: number, height: number, reversed: boolean = false): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.moveTo(0, height - 10);
    ctx.lineTo(width, height - 10);
    if (reversed) {
      this.rigthToLeftArrow(ctx, width, height);
    } else {
      this.leftToRightArrow(ctx, width, height);
    }
    ctx.stroke();
    return canvas;
  }

  leftToRightArrow(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.lineTo(width - 10, height - 20);
    ctx.moveTo(width, height - 10);
    ctx.lineTo(width - 10, height);
  }

  rigthToLeftArrow(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.moveTo(0, height - 10);
    ctx.lineTo(10, height - 20);
    ctx.moveTo(0, height - 10);
    ctx.lineTo(10, height);
  }

  write(text: string, canvas: HTMLCanvasElement, y: number) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = "24px serif";
    const width = ctx.measureText(text).width;
    const centerX = canvas.width / 2 - width / 2;
    ctx.fillText(text, centerX, y);
  }

  drawActions() {
    const nbActions = this.actions.length;
    if (nbActions == 0) return;
    const distBetweenActions = (this.canvas.height - 100) / (nbActions + 1);
    console.log("this.canvas.height " + this.canvas.height);

    console.log("distBetweenActions " + distBetweenActions);

    let y = 0;
    for (let action of this.actions) {

      y += distBetweenActions;
      this.drawAction(action, y);
    }
  }

  drawAction(action: Action, y: number) {
    console.log("plop");
    console.log(y)
    if (
      this.stepsVerification.get(action.stepStart) == undefined
      || this.stepsVerification.get(action.stepEnd) == undefined
    ) return;
    const xStart = this.stepsVerification.get(action.stepStart) as number;
    const xEnd = this.stepsVerification.get(action.stepEnd) as number;
    const canvas = this.createArrow(Math.abs(xEnd - xStart), 100, xEnd < xStart);
    this.write(action.wording, canvas, 80);
    this.context.drawImage(canvas, Math.min(xStart, xEnd) + 50, y);
  }
}
/*

declare subject customer
declare machine front-end
declare machine back-end
declare machine bdd
action customer click front-end

*/