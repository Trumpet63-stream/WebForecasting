import {Drawable} from "./Drawable";

export abstract class ChartElement implements Drawable {
    protected ctx: CanvasRenderingContext2D;

    protected constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    abstract draw(currentTimeMillis: DOMHighResTimeStamp): void
}

