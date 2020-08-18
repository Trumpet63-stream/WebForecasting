import {ChartElement} from "./ChartElement";
import {GridLines} from "./GridLines";

export class Axes extends ChartElement {
    private horizonalGridLines: GridLines;
    private verticalGridLines: GridLines;

    constructor(context: CanvasRenderingContext2D) {
        super(context);
    }

    public draw(currentTimeMillis: DOMHighResTimeStamp): void {

    }
}