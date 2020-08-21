import {Point2D} from "./Point2D";

export interface Predictor {
    predict(x: number): number;
}

export interface ModelSupplier {
    getPredictor(points: Point2D[]): Predictor;
}

export abstract class BackTesting {
    public static timeBetweenPoints: number = 86400000;
    public static ratio: number = 0.5;

    // Note: assumes points are sorted
    public static backTest(points: Point2D[], supplier: ModelSupplier): number[][] {
        let totalBackTests: number = 0;
        let errors: number[][] = [];
        let inputDataSize: number = Math.floor(points.length * this.ratio);

        for (let inputEnd = inputDataSize; inputEnd < points.length; inputEnd++) {
            let sample: Point2D[] = points.slice(inputEnd - inputDataSize, inputEnd);
            let predictor: Predictor = supplier.getPredictor(sample);

            for (let futureIndex = inputEnd; futureIndex < points.length; futureIndex++) {
                let futurePoint = points[futureIndex];
                let prediction = predictor.predict(futurePoint.x);
                let numUnitsInFuture = Math.round((futurePoint.x - sample[sample.length - 1].x) / this.timeBetweenPoints);
                this.ensureCapacity(errors, numUnitsInFuture + 1);
                errors[numUnitsInFuture].push(prediction - futurePoint.y);
                totalBackTests++;
            }
        }
        console.log("Total backtests = " + totalBackTests);

        BackTesting.report(errors);
        return errors;
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