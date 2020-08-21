import {Point2D} from "../src/scripts/Point2D";
import {QuantileHelper} from "../src/scripts/QuantileHelper";

it('does p50 right', () => {
    expectQuantileOfArrayToBe(0.50, getRange(1, 99, 1), 50);
    expectQuantileOfArrayToBe(0.50, getRange(1, 197, 2), 99);
    expectQuantileOfArrayToBe(0.50, getRange(1, 100, 1), 50.5);
});

it('does p0 right', () => {
    expectQuantileOfArrayToBe(0, getRange(1, 99, 1), 1);
});

it('does p100 right', () => {
    expectQuantileOfArrayToBe(1, getRange(1, 99, 1), 99);
});

it('does quantiles of tiny arrays correctly', () => {
    expectQuantileOfArrayToBe(1, [0], 0);
    expectQuantileOfArrayToBe(0.75, [0], 0);
    expectQuantileOfArrayToBe(0.5, [0], 0);
    expectQuantileOfArrayToBe(0.25, [0], 0);
    expectQuantileOfArrayToBe(0, [0], 0);

    expectQuantileOfArrayToBe(1, [1, 2], 2);
    expectQuantileOfArrayToBe(0.5, [1, 2], 1.5);
    expectQuantileOfArrayToBe(0, [1, 2], 1);
});

it('adds quantile to forecast correctly', () => {
    let forecast: Point2D[] = [point(1), point(2), point(3), point(4), point(5), point(6)];
    let errors: number[][] = [[], [1], [1], [1], [1], [1], [1]];
    let forecastQuantile: Point2D[] = QuantileHelper.getForecastQuantile(forecast, errors, 1);
    expect(forecastQuantile).toEqual([point(3), point(4), point(5), point(6), point(7)]);
});

function expectQuantileOfArrayToBe(q: number, values: number[], expectedValue: number) {
    let forecast: Point2D[] = [point(0), point(0)];
    let forecastQuantile: Point2D[] = QuantileHelper.getForecastQuantile(forecast, [[], values], q);
    expect(forecastQuantile[0].y).toEqual(expectedValue);
}

function getRange(start: number, end: number, increment: number) {
    let range: number[] = [];
    for (let n = start; n <= end; n += increment) {
        range.push(n);
    }
    return range;
}

function point(y: number): Point2D {
    return new Point2D(0, y);
}