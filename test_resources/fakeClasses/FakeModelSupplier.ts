import {Model, ModelSupplier} from "../../src/scripts/Backtesting";
import {Point2D} from "../../src/scripts/Point2D";
import {FakeModel} from "./FakeModel";

export class FakeModelSupplier implements ModelSupplier {
    private readonly fakeModel: Model;

    constructor(fakeModel: FakeModel) {
        this.fakeModel = fakeModel;
    }

    getModel(points: Point2D[]): Model {
        return this.fakeModel;
    }
}