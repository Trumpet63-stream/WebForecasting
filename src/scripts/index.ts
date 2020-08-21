import {ParsingError} from "./errors/ParsingError";
import {Point2D} from "./Point2D";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {ForecastChart} from "./ForecastChart";
import {RegressionJS} from "./RegressionJS";
import {Result} from "regression";
import {LinkedMenu} from "./LinkedMenu";
import {LinkedMenuManager} from "./LinkedMenuManager";
import {BackTesting, ModelSupplier, Predictor} from "./BackTesting";

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

let chart = new ForecastChart(ctx);

// Chained select menu
let menuManager: LinkedMenuManager = new LinkedMenuManager();

let orderSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("order");
let orderMenu: LinkedMenu = new LinkedMenu(orderSelect, new Map<string, LinkedMenu>());
orderSelect.onchange = () => menuManager.selected(orderMenu);

let methodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("method");
let methodMenu: LinkedMenu = new LinkedMenu(methodSelect, new Map<string, LinkedMenu>([["polynomial", orderMenu]]));
methodSelect.onchange = () => menuManager.selected(methodMenu);

let providerSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("provider");
let providerMenu = new LinkedMenu(providerSelect, new Map<string, LinkedMenu>([["regression-js", methodMenu]]));
providerSelect.onchange = () => menuManager.selected(providerMenu);

menuManager.init(providerMenu, doSelection);

function doSelection(selection: string[]) {
    if (selection[0] === "regression-js") {
        let points = chart.getData();

        let modelSupplier = new class implements ModelSupplier {
            getPredictor(points: Point2D[]): Predictor {
                let result: Result = new RegressionJS().runFit(points, selection.slice(1));
                return new class implements Predictor {
                    predict(x: number): number {
                        return result.predict(x)[1];
                    }
                }
            }
        }
        let errors: number[][] = BackTesting.backTest(points, modelSupplier);

        let inputDataSize: number = Math.floor(points.length * BackTesting.ratio);
        let sample: Point2D[] = points.slice(points.length - inputDataSize, points.length);
        let predictor: Predictor = modelSupplier.getPredictor(sample);
        let forecast: Point2D[] = [];
        for (let i = 0; i < sample.length; i++) {
            forecast.push(new Point2D(sample[i].x, predictor.predict(sample[i].x)));
        }

        let futureDataStartIndex: number = forecast.length;
        for (let i = 1; i < errors.length; i++) {
            if (errors[i].length > 0) {
                let x: number = points[points.length - 1].x + BackTesting.timeBetweenPoints * i;
                let prediction: number = predictor.predict(x);
                forecast.push(new Point2D(x, prediction));
            }
        }
        chart.setForecast(forecast);

        let futurePoints = forecast.slice(futureDataStartIndex - 1);
        let summary: Point2D[] = getForecastQuantile(futurePoints, errors, 0.95).concat(
            getForecastQuantile(futurePoints, errors, 0.5)
        ).concat(
            getForecastQuantile(futurePoints, errors, 0.05)
        );
        chart.setBacktesting(summary);
    }
}

function getForecastQuantile(forecast: Point2D[], errors: number[][], q: number): Point2D[] {
    let forecastQuantile: Point2D[] = [];
    for (let i = 1; i < forecast.length; i++) {
        let errorQuantile: number = quantile(errors[i], q);
        forecastQuantile.push(new Point2D(forecast[i].x, forecast[i].y + errorQuantile));
    }
    return forecastQuantile;
}

function quantile(arr: number[], q: number) {
    let sorted = getSortedAscending(arr);
    let pos = (sorted.length - 1) * q;
    let base = Math.floor(pos);
    let rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}

function getSortedAscending(a: number[]): number[] {
    let copy: number[] = [];
    for (let i = 0; i < a.length; i++) {
        copy.push(a[i]);
    }
    return copy.sort((a, b) => a - b);
}

let

    pointParser = new PointParser(new CSVParser());
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
    }
});

function getBestFit(points: Point2D[], result: Result) {
    let bestFit = [];
    for (let i = 0; i < points.length; i++) {
        bestFit.push(new Point2D(points[i].x, result.predict(points[i].x)[1]));
    }
    return bestFit
}
