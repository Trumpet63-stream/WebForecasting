import {Point2D} from "./Point2D";
import Chart from "chart.js";

export class ForecastChart {
    private chart: Chart;
    private options = {
        scales: {
            xAxes: [{
                ticks: {
                    callback: (value: string | number | Date) => {
                        return new Date(value).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        });
                    }
                }
            }]
        }
    }

    constructor(context: CanvasRenderingContext2D) {
        this.chart = new Chart(context, {
            type: 'scatter',
            data: {
                datasets: []
            },
            options: this.options
        });
    }

    public setData(points: Point2D[]) {
        this.chart.data.datasets[0] = {
            label: "Input",
            data: points
        }
        this.chart.update();
    }

    public setBestFit(points: Point2D[]) {
        this.chart.data.datasets[1] = {
            label: "Best Fit",
            data: points
        }
        this.chart.update();
    }
}