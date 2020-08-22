import {Model} from "../../src/scripts/Backtesting";

export class FakeModel implements Model {
    predict(x: number): number {
        return 0;
    }
}