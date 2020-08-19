import regression, {Result} from 'regression';
import {Point2D} from "./Point2D";

export class BestFit {
    constructor() {
    }

    public runFit(points: Point2D[]): Result {
        // @ts-ignore
        return regression.polynomial(points,
            {
                order: 2,
                precision: 14
            });
    }
}