import {ChartElement} from "./ChartElement";

export class Background extends ChartElement {
    public constructor(context: CanvasRenderingContext2D) {
        super(context);
    }

    draw(currentTimeMillis: DOMHighResTimeStamp): void {
        this.ctx.save();
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }
}