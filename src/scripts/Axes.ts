import {ChartElement} from "./ChartElement";
import {Point2D} from "./Point2D";
import {Rectangle} from "./Rectangle";
import {GridLine} from "./GridLine";

export class Axes extends ChartElement {
    private horizontalGridLines: GridLine[];
    private verticalGridLines: GridLine[];
    private bounds: Rectangle;

    constructor(context: CanvasRenderingContext2D, bounds: Rectangle) {
        super(context);
        this.bounds = bounds;
        this.horizontalGridLines = [];
        this.verticalGridLines = [];
    }

    public setGridLines(horizontal: GridLine[], vertical: GridLine[]) {
        this.horizontalGridLines = horizontal;
        this.verticalGridLines = vertical;
    }

    public draw(currentTimeMillis: DOMHighResTimeStamp): void {
        for (let i = 0; i < this.horizontalGridLines.values.length; i++) {
            this.drawHorizontalGridLine(this.horizontalGridLines[i]);
        }

        for (let i = 0; i < this.verticalGridLines.values.length; i++) {
            this.drawVerticalGridLine(this.verticalGridLines[i]);
        }
    }

    private drawHorizontalGridLine(gridLine: GridLine) {
        let startPoint: Point2D = new Point2D(this.bounds.topLeftX, gridLine.position - 5);
        let endPoint: Point2D = new Point2D(this.bounds.topLeftX + this.bounds.width, gridLine.position - 5);
        this.drawLine(startPoint, endPoint);
        this.drawLeftText(gridLine.value, startPoint);
    }

    private drawVerticalGridLine(gridLine: GridLine) {
        let startPoint: Point2D = new Point2D(gridLine.position + 5, this.bounds.topLeftY + this.bounds.height);
        let endPoint: Point2D = new Point2D(gridLine.position + 5, this.bounds.topLeftY + this.bounds.height + 5);
        this.drawLine(startPoint, endPoint);
        this.drawBottomText(gridLine.value, startPoint);
    }

    private drawLine(startPoint: Point2D, endPoint: Point2D) {
        let ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
    }

    private drawLeftText(text: string, rightMiddle: Point2D) {
        let ctx = this.ctx;
        ctx.save();
        ctx.font = "20px Georgia";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(text, rightMiddle.x, rightMiddle.y);
        ctx.restore();
    }

    private drawBottomText(text: string, centerTop: Point2D) {
        let ctx = this.ctx;
        ctx.save();
        ctx.font = "20px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(text, centerTop.x, centerTop.y);
        ctx.restore();
    }
}