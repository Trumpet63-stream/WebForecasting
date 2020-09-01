import * as tf from '@tensorflow/tfjs';
import {Model, ModelSupplier} from "./Backtesting";
import {Point2D} from "./Point2D";
import {Visor} from "./Visor";
import {LinearScaler} from "./LinearScaler";
import {Scaler} from "./Scaler";

export abstract class NNModel {
    public static getModelSupplier(options: string[]): ModelSupplier {
        const learningRate: number = 0.5;
        const model: tf.Sequential = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1], units: 1}));
        model.compile({
            loss: tf.losses.meanSquaredError,
            optimizer: tf.train.sgd(learningRate),
        });
        return {
            getModel(points: Point2D[]): Promise<Model> {
                let minX = Math.min.apply(null, points.map(p => p.x));
                let maxX = Math.max.apply(null, points.map(p => p.x));
                let minY = Math.min.apply(null, points.map(p => p.y));
                let maxY = Math.max.apply(null, points.map(p => p.y));
                let xScaler: Scaler = new LinearScaler(minX, maxX);
                let yScaler: Scaler = new LinearScaler(minY, maxY);

                return model.fit(
                    tf.tensor1d(points.map(p => xScaler.scale(p.x))),
                    tf.tensor1d(points.map(p => yScaler.scale(p.y))),
                    {
                        batchSize: points.length,
                        epochs: 80,
                        callbacks: Visor.getFitCallbacks()
                    }
                ).then(() => {
                    return {
                        predict(x: number): number {
                            let scaledX = xScaler.scale(x);
                            let scaledY = (<tf.Tensor>model.predict(tf.tensor1d([scaledX]))).dataSync()[0];
                            return yScaler.unscale(scaledY);
                        }
                    }
                });
            }
        };
    }
}
