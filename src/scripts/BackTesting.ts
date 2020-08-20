import {Point2D} from "./Point2D";

export interface Predictor {
    predict(x: number): number;
}

export interface ModelSupplier {
    getPredictor(points: Point2D[]): Predictor;
}

export abstract class BackTesting {
    private static timeBetweenPoints: number = 86400000;
    private static ratio: number = 0.5;

    // Note: assumes points are sorted
    public static backTest(points: Point2D[], supplier: ModelSupplier): number[][] {
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
            }
        }

        return errors;
    }

    private static ensureCapacity(errors: number[][], capacity: number) {
        while (errors.length < capacity) {
            errors.push([]);
        }
    }
} 