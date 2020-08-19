import {ParsingError} from "./errors/ParsingError";
import {Point2D} from "./Point2D";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {ForecastChart} from "./ForecastChart";
import {BestFit} from "./BestFit";
import {Result} from "regression";

function lineBreak(): Element {
    return document.createElement("br");
}

function setDimensions(canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number) {
    cssWidth = 1280;
    cssHeight = 720;

    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    let scale = window.devicePixelRatio;
    canvas.width = cssWidth * scale;
    canvas.height = cssHeight * scale;

    // Normalize coordinate system to use css pixels.
    canvas.getContext("2d").scale(scale, scale);
}

let htmlCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
htmlCanvasElement.classList.add("forecasting-canvas");
document.body.appendChild(htmlCanvasElement);
setDimensions(htmlCanvasElement, 1280, 720);
let ctx = htmlCanvasElement.getContext("2d");

document.body.appendChild(lineBreak());

let dataInput: Element = document.createElement("textarea");
dataInput.classList.add("forecasting-text-input");
dataInput.setAttribute("rows", "10");
dataInput.setAttribute("cols", "50");
document.body.appendChild(dataInput);

let chart = new ForecastChart(ctx);

let pointParser = new PointParser(new CSVParser());
dataInput.addEventListener("input", (e: Event) => {
    let points: Point2D[] = [];
    try {
        points = pointParser.parse((<HTMLInputElement>e.target).value);
    } catch (e) {
        if (!(e instanceof ParsingError)) {
            throw e;
        }
    }
    if (points.length !== 0) {
        chart.setData(points);
        let result: Result = new BestFit().runFit(points);
        let bestFit: Point2D[] = getBestFit(points, result);
        chart.setBestFit(bestFit);
    }
});

function getBestFit(points: Point2D[], result: Result) {
    let bestFit = [];
    for (let i = 0; i < points.length; i++) {
        bestFit.push(new Point2D(points[i].x, result.predict(points[i].x)[1]));
    }
    return bestFit
}