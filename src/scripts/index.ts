import {AnimationController} from "./AnimationController";
import {Chart} from "./Chart";
import {PointParser} from "./PointParser";
import {CSVParser} from "./CSVParser";
import {Point2D} from "./Point2D";
import {ParsingError} from "./errors/ParsingError";

function lineBreak(): Element {
    return document.createElement("br");
}

let htmlCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
htmlCanvasElement.classList.add("forecasting-canvas");
document.body.appendChild(htmlCanvasElement);

document.body.appendChild(lineBreak());

let dataInput: Element = document.createElement("textarea");
dataInput.classList.add("forecasting-text-input");
dataInput.setAttribute("rows", "10");
dataInput.setAttribute("cols", "50");
document.body.appendChild(dataInput);

let chart: Chart = new Chart(htmlCanvasElement.getContext("2d"));

let controller: AnimationController = new AnimationController();
controller.enableDraw(chart.draw.bind(chart));

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
    console.log(points);
});
