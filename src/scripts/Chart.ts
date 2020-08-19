import {Drawable} from "./Drawable";
import {Background} from "./Background";
import {DisplayedPoints} from "./DisplayedPoints";
import {Point2D} from "./Point2D";
import {Axes} from "./Axes";
import {Rectangle} from "./Rectangle";
import {Mapper2D} from "./Mapper2D";
import {GridLines} from "./GridLines";

export class Chart implements Drawable {
    private ctx: CanvasRenderingContext2D;
    private readonly mapper: Mapper2D;
    private background: Background;
    private displayedPoints: DisplayedPoints;
    private axes: Axes;

    constructor(context: CanvasRenderingContext2D, mapper: Mapper2D, chartBounds: Rectangle) {
        this.ctx = context;
        this.mapper = mapper;
        this.background = new Background(context);
        this.displayedPoints = new DisplayedPoints(context);
        this.axes = new Axes(context, chartBounds);
    }

    public draw(currentTimeMillis: DOMHighResTimeStamp): void {
        this.background.draw(currentTimeMillis);
        this.axes.draw(currentTimeMillis);
        this.displayedPoints.draw(currentTimeMillis);
    }

    public setDisplayedPoints(graphPoints: Point2D[]): void {
        let mappedPoints: Point2D[] = graphPoints.map(this.mapper.graphToPixel.bind(this.mapper));
        this.displayedPoints.setPoints(mappedPoints);
        this.updateGridLines(graphPoints);
    }

    private updateGridLines(graphPoints: Point2D[]) {
        let gridLines = GridLines.ofPoints(graphPoints, this.mapper);
        this.axes.setGridLines(gridLines.horizontal, gridLines.vertical);
    }
}