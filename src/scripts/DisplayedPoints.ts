import {Point2D} from "./Point2D";
import {ChartElement} from "./ChartElement";

export class DisplayedPoints extends ChartElement {
    private pixelPoints: Point2D[];

    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.pixelPoints = [];
    }

    public setPoints(pixelPoints: Point2D[]): void {
        this.pixelPoints = pixelPoints;
    }

    public draw(currentTimeMillis: DOMHighResTimeStamp): void {
        for(let i = 0; i < this.pixelPoints.length; i++) {
            this.drawPoint(this.pixelPoints[i]);
        }
    }

    private drawPoint(point: Point2D): void {
        let ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    }
}