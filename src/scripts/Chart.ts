import {Drawable} from "./Drawable";
import {Background} from "./Background";
import {DisplayedPoints} from "./DisplayedPoints";
import {Point2D} from "./Point2D";
import {Axes} from "./Axes";

export class Chart implements Drawable {
    private ctx: CanvasRenderingContext2D;
    private background: Background;
    private displayedPoints: DisplayedPoints;
    private axes: Axes;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.background = new Background(context);
        this.displayedPoints = new DisplayedPoints(context);
        this.axes = new Axes(context);
    }

    public draw(currentTimeMillis: DOMHighResTimeStamp): void {
        this.background.draw(currentTimeMillis);
        this.axes.draw(currentTimeMillis);
        this.displayedPoints.draw(currentTimeMillis);
    }

    public setDisplayedPoints(pixelPoints: Point2D[]): void {
        this.displayedPoints.setPoints(pixelPoints);
    }
}