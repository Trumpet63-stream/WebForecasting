import * as tf from '@tensorflow/tfjs';
import {Model, ModelSupplier} from "./scripts/Backtesting";
import {Point2D} from "./scripts/Point2D";

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
            getModel(points: Point2D[]): Model {
                async () => await model.fit(
                    tf.tensor1d(points.map(p => p.x)),
                    tf.tensor1d(points.map(p => p.y)),
                    {
                        batchSize: points.length,
                        epochs: 10
                    });
                return {
                    predict(x: number): number {
                        return (<tf.Tensor>model.predict(tf.tensor1d([x]))).dataSync()[0];
                    }
                };
            }
        };
    }
}
