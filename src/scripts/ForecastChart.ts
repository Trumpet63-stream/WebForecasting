import {Point2D} from "./Point2D";
import Chart, {ChartColor, ChartDataSets} from "chart.js";

export class ForecastChart {
    private chart: Chart;
    private chartData: Point2D[];
    private options = {
        responsive: false,
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

    public getData(): Point2D[] {
        return this.chartData;
    }

    public setData(points: Point2D[]) {
        this.chartData = points;
        this.putData(points, "Input", 'rgba(0, 0, 255, 0.5)');
    }

    public setBestFit(points: Point2D[]) {
        this.putData(points, "Best Fit", undefined);
    }

    public setForecast(points: Point2D[]) {
        this.putData(points, "Forecast", 'rgba(0, 255, 0, 0.5)');
    }

    public setBacktesting(points: Point2D[]) {
        this.putData(points, "Backtesting", 'rgba(255, 0, 0, 0.2)');
    }

    private putData(points: Point2D[], label: string, pointColor: ChartColor) {
        let datasets: ChartDataSets[] = this.chart.data.datasets;
        let index: number = datasets.length;
        for (let i = 0; i < datasets.length; i++) {
            if (label === datasets[i].label) {
                index = i;
            }
        }

        this.chart.data.datasets[index] = {
            label: label,
            pointBackgroundColor: pointColor,
            data: points
        }

        this.chart.update();
    }
}