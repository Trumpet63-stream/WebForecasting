import {GridLine} from "./GridLine";
import {Mapper2D} from "./Mapper2D";
import {Point2D} from "./Point2D";

export abstract class GridLines {
    public static minLines: number = 4;
    public static maxLines: number = 13;

    public static ofPoints(points: Point2D[], mapper: Mapper2D): { horizontal: GridLine[], vertical: GridLine[] } {
        let xMin: number = this.min(points.map(p => p.x));
        let xMax: number = this.max(points.map(p => p.x));
        let xRange = this.describeRange(xMin, xMax);
        let xValues = this.cleanValues(xRange.values);

        let yMin: number = this.min(points.map(p => p.y));
        let yMax: number = this.max(points.map(p => p.y));
        let yRange = this.describeRange(yMin, yMax);
        let yValues = this.cleanValues(yRange.values);

        let xPositions = xRange.values.map(x => mapper.graphToPixel(new Point2D(x, 0)).x);
        let yPositions = yRange.values.map(y => mapper.graphToPixel(new Point2D(0, y)).y);

        let vertical: GridLine[] = [];
        for (let i = 0; i < xValues.length; i++) {
            vertical.push(new GridLine(xPositions[i], xValues[i]));
        }

        let horizontal: GridLine[] = [];
        for (let i = 0; i < yValues.length; i++) {
            horizontal.push(new GridLine(yPositions[i], yValues[i]));
        }

        return {horizontal: horizontal, vertical: vertical};
    }

    private static min(numbers: number[]) {
        let min = Number.POSITIVE_INFINITY;
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] < min) {
                min = numbers[i];
            }
        }
        return min;
    }

    private static max(numbers: number[]) {
        let max = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        return max;
    }

    private static cleanValues(values: number[]): string[] {
        let cleanedValues: string[] = [];
        for (let i = 0; i < values.length; i++) {
            cleanedValues.push(values[i].toPrecision(2));
        }
        return cleanedValues;
    }

    private static describeRange(min: number, max: number): { values: number[], scale: number } {
        let difference = max - min;
        let scale: number = this.getScale(difference, max);

        let values: number[];
        if (difference === 0) {
            let rounded = Math.round(max / scale) * scale;
            values = [rounded - 2 * scale, rounded - scale, rounded, rounded + scale];
        } else {
            let minIncrement = GridLines.getFirstMultipleGreater(scale, difference / (this.maxLines - 1));
            let maxIncrement = GridLines.getFirstMultipleLesser(scale, difference / this.minLines);
            let bestIncrement = this.getBestIncrement(minIncrement, maxIncrement, scale, min, max);
            values = GridLines.getValues(min, max, bestIncrement);
        }

        return {values: values, scale: scale}
    }

    private static getScale(difference: number, max: number) {
        if (difference === 0) {
            difference = Math.max(Math.abs(max), 0.001);
        }
        return Math.pow(10, Math.floor(Math.log10(difference / 10)));
    }

    private static getBestIncrement(minIncrement: number, maxIncrement: number, scale: number, min: number, max: number) {
        let bestIncrement;
        let bestWhiteSpace = 100;
        for (let i = minIncrement; i <= maxIncrement; i += scale) {
            let lowerBound = GridLines.getFirstMultipleLesser(i, min);
            let upperBound = GridLines.getFirstMultipleGreater(i, max);
            let whiteSpace = GridLines.calculateWhiteSpacePercent(lowerBound, min, max, upperBound);

            // use <= so we prefer bigger increments, fewer grid lines
            if (whiteSpace <= bestWhiteSpace) {
                bestWhiteSpace = whiteSpace;
                bestIncrement = i;
            }
        }
        return bestIncrement;
    }

    private static getValues(min: number, max: number, increment: number) {
        let lowerBound: number = GridLines.getFirstMultipleLesser(increment, min);
        let upperBound: number = GridLines.getFirstMultipleGreater(increment, max);
        let numMultiples: number = Math.round((upperBound - lowerBound) / increment);
        let values: number[] = [];
        for (let i = 0; i <= numMultiples; i++) {
            values.push(lowerBound + i * increment);
        }
        return values;
    }

    private static calculateWhiteSpacePercent(lowerBound: number, min: number, max: number, upperBound: number) {
        let whiteSpace = (min - lowerBound) + (upperBound - max);
        return whiteSpace / (upperBound - lowerBound) * 100;
    }

    private static getFirstMultipleGreater(factor: number, target: number) {
        return Math.ceil(target / factor) * factor;
    }

    private static getFirstMultipleLesser(factor: number, target: number) {
        return Math.floor(target / factor) * factor;
    }
}