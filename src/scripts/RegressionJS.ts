import regression, {DataPoint, Options, Result} from 'regression';
import {Point2D} from "./Point2D";
import {ModelSupplier, Predictor} from "./Backtesting";

export class RegressionJS {
    private globalOptions: Options = {
        precision: 100
    }

    public runFit(points: Point2D[], options: string[]): Result {
        let data: DataPoint[] = RegressionJS.pointsToArrays(points);
        switch (options[0]) {
            case "linear":
                return regression.linear(data, this.globalOptions);
            case "polynomial":
                return regression.polynomial(data, Object.assign(this.globalOptions,
                    {
                        order: parseInt(options[1])
                    }));
            case "power":
                return regression.power(data, this.globalOptions);
            case "exponential":
                return regression.exponential(data, this.globalOptions);
            case "logarithmic":
                return regression.logarithmic(data, this.globalOptions);
        }
    }

    private static pointsToArrays(points: Point2D[]): DataPoint[] {
        let data: DataPoint[] = [];
        for (let i = 0; i < points.length; i++) {
            data.push([points[i].x, points[i].y]);
        }
        return data;
    }

    public static getModelSupplier(options: string[]): ModelSupplier {
        return new class implements ModelSupplier {
            getPredictor(points: Point2D[]): Predictor {
                let result: Result = new RegressionJS().runFit(points, options);
                return new class implements Predictor {
                    predict(x: number): number {
                        return result.predict(x)[1];
                    }
                }
            }
        }
    }
}