import {Point2D} from "./Point2D";

export abstract class QuantileHelper {
    public static getForecastQuantile(forecast: Point2D[], errors: number[][], q: number): Point2D[] {
        let forecastQuantile: Point2D[] = [];
        for (let i = 1; i < forecast.length; i++) {
            let errorQuantile: number = this.quantile(errors[i], q);
            forecastQuantile.push(new Point2D(forecast[i].x, forecast[i].y - errorQuantile));
        }
        return forecastQuantile;
    }

    private static quantile(arr: number[], q: number) {
        let sorted = this.getSortedAscending(arr);
        let rank = q * (sorted.length - 1);
        let base = Math.floor(rank);
        let rest = rank - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    }

    private static getSortedAscending(a: number[]): number[] {
        let copy: number[] = [];
        for (let i = 0; i < a.length; i++) {
            copy.push(a[i]);
        }
        return copy.sort((a, b) => a - b);
    }
}