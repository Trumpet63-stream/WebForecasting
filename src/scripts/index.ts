import {ParsingError} from "./errors/ParsingError";
import {Point2D} from "./Point2D";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {ForecastChart} from "./ForecastChart";
import {RegressionJS} from "./RegressionJS";
import {LinkedMenu} from "./LinkedMenu";
import {LinkedMenuManager} from "./LinkedMenuManager";
import {Backtesting, Model, ModelSupplier} from "./Backtesting";
import {QuantileHelper} from "./QuantileHelper";
import {DefaultModels} from "./DefaultModels";

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

let regressionJSmethodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("regression-js_method");
let regressionJSmethodMenu: LinkedMenu = new LinkedMenu(regressionJSmethodSelect, new Map<string, LinkedMenu>([
    ["polynomial", orderMenu]
]));
regressionJSmethodSelect.onchange = () => menuManager.selected(regressionJSmethodMenu);

let defaultMethodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("default_method");
let defaultMethodMenu: LinkedMenu = new LinkedMenu(defaultMethodSelect, new Map<string, LinkedMenu>());
defaultMethodSelect.onchange = () => menuManager.selected(defaultMethodMenu);

let providerSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("provider");
let providerMenu = new LinkedMenu(providerSelect, new Map<string, LinkedMenu>([
    ["regression-js", regressionJSmethodMenu],
    ["default", defaultMethodMenu]
]));
providerSelect.onchange = () => menuManager.selected(providerMenu);

menuManager.init(providerMenu, doSelection);

function doSelection(selection: string[]) {
    let points = chart.getData();
    if (selection[0] === "regression-js") {
        let modelSupplier = RegressionJS.getModelSupplier(selection.slice(1));
        showForecastAndBacktests(points, modelSupplier);
    } else if (selection[0] === "default") {
        let modelSupplier = DefaultModels.getModelSupplier(selection.slice(1));
        showForecastAndBacktests(points, modelSupplier);
    }
}

function showForecastAndBacktests(points: Point2D[], modelSupplier: ModelSupplier) {
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