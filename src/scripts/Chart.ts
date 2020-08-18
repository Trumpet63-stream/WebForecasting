import {Drawable} from "./Drawable";
import {Background} from "./Background";

export class Chart implements Drawable {
    private ctx: CanvasRenderingContext2D;
    private background: Background;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.background = new Background(context);
    }

    draw(currentTimeMillis: DOMHighResTimeStamp): void {
        this.background.draw(currentTimeMillis);
    }
}