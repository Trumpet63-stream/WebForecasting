import {Scaler} from "./Scaler";

export class LinearScaler implements Scaler {
    private readonly min: number;
    private readonly max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    public scale(value: number): number {
        return (value - this.min) / (this.max - this.min);
    }

    public unscale(value: number): number {
        return value * (this.max - this.min) + this.min;
    }
}