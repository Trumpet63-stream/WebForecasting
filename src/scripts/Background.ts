import {Drawable} from "./Drawable";

export class Background implements Drawable {
    private ctx: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    draw(currentTimeMillis: DOMHighResTimeStamp): void {
        this.ctx.save();
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }
}