import {Point2D} from "./Point2D";

export interface Model {
    predict(x: number): number;
}

export interface ModelSupplier {
    getModel(points: Point2D[]): Model | Promise<Model>;
}

export abstract class Backtesting {
    public static timeBetweenPoints: number = 86400000;
    public static ratio: number = 0.5;

    // Note: assumes points are sorted ascending by x value
    public static slidingWindowBacktest(points: Point2D[], supplier: ModelSupplier): number[][] {
        let totalBackTests: number = 0;
        let errors: number[][] = [];
        let sampleDataSize: number = Math.floor(points.length * this.ratio);
        let sampleStartTime = points[0].x;
        let sampleStartIndex = 0;
        let sampleEndTime = sampleStartTime + (sampleDataSize - 1) * this.timeBetweenPoints;
        let sampleEndIndex = 0;
        let finalEndTime = points[points.length - 1].x;

        while (sampleEndTime < finalEndTime) {
            sampleStartIndex = this.getSampleStartIndex(sampleStartIndex, points, sampleStartTime);
            sampleEndIndex = this.getSampleEndIndex(sampleEndIndex, points, sampleEndTime);
            let sample: Point2D[] = points.slice(sampleStartIndex, sampleEndIndex + 1);
            let model: Model = <Model>supplier.getModel(sample);
            for (let futureIndex = sampleEndIndex + 1; futureIndex < points.length; futureIndex++) {
                let futurePoint = points[futureIndex];
                let prediction = model.predict(futurePoint.x);
                let predictionError: number = prediction - futurePoint.y;
                let numUnitsInFuture = Math.round((futurePoint.x - sampleEndTime) / this.timeBetweenPoints);
                this.ensureCapacity(errors, numUnitsInFuture + 1);
                errors[numUnitsInFuture].push(predictionError);
                totalBackTests++;
            }

            sampleStartTime += this.timeBetweenPoints;
            sampleEndTime += this.timeBetweenPoints;
        }

        Backtesting.report(errors);
        return errors;
    }

    private static getSampleEndIndex(sampleEndIndex: number, points: Point2D[], sampleEndTime: number) {
        while (sampleEndIndex + 1 < points.length - 1 && points[sampleEndIndex + 1].x <= sampleEndTime) {
            sampleEndIndex++;
        }
        return sampleEndIndex;
    }

    private static getSampleStartIndex(sampleStartIndex: number, points: Point2D[], sampleStartTime: number) {
        while (sampleStartIndex + 1 < points.length - 1 && points[sampleStartIndex].x < sampleStartTime) {
            sampleStartIndex++;
        }
        return sampleStartIndex;
    }

    private static report(errors: number[][]) {
        // let output: HTMLTextAreaElement = document.createElement("textarea");
        // let report = "";
        // for (let i = 0; i < errors.length; i++) {
        //     report += errors[i].join(",") + ";\n"
        // }
        // output.value = report;
        // document.body.appendChild(output);
    }

    private static ensureCapacity(errors: number[][], capacity: number) {
        while (errors.length < capacity) {
            errors.push([]);
        }
    }
} 