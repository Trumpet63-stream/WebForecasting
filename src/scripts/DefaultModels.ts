import {Point2D} from "./Point2D";
import {Model, ModelSupplier} from "./Backtesting";

export class DefaultModels {
    public static getModelSupplier(options: string[]): ModelSupplier {
        switch (options[0]) {
            case "previous":
                return this.previousModelSupplier();
        }
    }

    private static previousModelSupplier() {
        return {
            getModel(points: Point2D[]): Model {
                return {
                    predict(x: number): number {
                        return points[points.length - 1].y;
                    }
                }
            }
        }
    }
}