import {AnimationController} from "./AnimationController";
import {Chart} from "./Chart";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {Point2D} from "./Point2D";
import {ParsingError} from "./errors/ParsingError";
import {Space2D} from "./Space2D";
import {Mapper2D} from "./Mapper2D";

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

document.body.appendChild(lineBreak());

let dataInput: Element = document.createElement("textarea");
dataInput.classList.add("forecasting-text-input");
dataInput.setAttribute("rows", "10");
dataInput.setAttribute("cols", "50");
document.body.appendChild(dataInput);

let chart: Chart = new Chart(htmlCanvasElement.getContext("2d"));

let controller: AnimationController = new AnimationController();
controller.enableDraw(chart.draw.bind(chart));

let graphSpace: Space2D = new Space2D(0, 100, 0, 100);
let pixelSpace: Space2D = new Space2D(0, htmlCanvasElement.width, 0, htmlCanvasElement.height);
let mapper: Mapper2D = new Mapper2D(graphSpace, pixelSpace);

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
        let mappedPoints: Point2D[] = points.map(mapper.graphToPixel.bind(mapper));
        chart.setDisplayedPoints(mappedPoints);
    }
});
