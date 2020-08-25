import {ParsingError} from "./errors/ParsingError";
import {Point2D} from "./Point2D";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {ForecastChart} from "./ForecastChart";
import {Backtesting, Model, ModelSupplier} from "./Backtesting";
import {QuantileHelper} from "./QuantileHelper";
import {menuManager} from "./Menus";

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

let htmlCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("chart");
setDimensions(htmlCanvasElement, 1280, 720);
let ctx = htmlCanvasElement.getContext("2d");

let dataInput: Element = document.getElementById("data");

export const chart = new ForecastChart(ctx);

export function showForecastAndBacktests(points: Point2D[], modelSupplier: ModelSupplier) {
    let errors: number[][] = Backtesting.backTest(points, modelSupplier);

    let inputDataSize: number = Math.floor(points.length * Backtesting.ratio);
    let sample: Point2D[] = points.slice(points.length - inputDataSize, points.length);
    let predictor: Model = modelSupplier.getModel(sample);
    let forecast: Point2D[] = [];
    for (let i = 0; i < sample.length; i++) {
        forecast.push(new Point2D(sample[i].x, predictor.predict(sample[i].x)));
    }

    let futureDataStartIndex: number = forecast.length;
    for (let i = 1; i < errors.length; i++) {
        if (errors[i].length > 0) {
            let x: number = points[points.length - 1].x + Backtesting.timeBetweenPoints * i;
            let prediction: number = predictor.predict(x);
            forecast.push(new Point2D(x, prediction));
        }
    }
    chart.setForecast(forecast);

    let futurePoints = forecast.slice(futureDataStartIndex - 1);
    let summary: Point2D[] = QuantileHelper.getForecastQuantile(futurePoints, errors, 0.95).concat(
        QuantileHelper.getForecastQuantile(futurePoints, errors, 0.5)
    ).concat(
        QuantileHelper.getForecastQuantile(futurePoints, errors, 0.05)
    );
    chart.setBacktesting(summary);
}

let pointParser = new PointParser(new CSVParser());
dataInput.addEventListener("input", (e: Event) => {
    let points: Point2D[] = [];
    try {
        points = pointParser.parseTimeSeries((<HTMLInputElement>e.target).value);
    } catch (e) {
        if (!(e instanceof ParsingError)) {
            throw e;
        }
    }
    if (points.length !== 0) {
        chart.setData(points);
        menuManager.refireLastSelection();
    }
});