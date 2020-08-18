export class GridLines {
    public static minLines: number = 4;
    public static maxLines: number = 13;
    public values: number[];
    public scale: number;

    private constructor() {
    }

    public static ofRange(min: number, max: number): GridLines {
        let difference = max - min;
        let scale: number = this.getScale(difference, max);
        let gridLines: GridLines = new GridLines();

        if (difference === 0) {
            let rounded = Math.round(max / scale) * scale;
            gridLines.values = [rounded - 2 * scale, rounded - scale, rounded, rounded + scale];
        } else {
            let minIncrement = GridLines.getFirstMultipleGreater(scale, difference / (this.maxLines - 1));
            let maxIncrement = GridLines.getFirstMultipleLesser(scale, difference / this.minLines);
            let bestIncrement = this.getBestIncrement(minIncrement, maxIncrement, scale, min, max);
            gridLines.values = GridLines.getValues(min, max, bestIncrement);
        }

        gridLines.scale = scale;
        return gridLines;
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