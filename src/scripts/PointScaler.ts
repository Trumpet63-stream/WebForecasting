import {Scaler} from "./Scaler";
import {Point2D} from "./Point2D";

export class PointScaler {
    private readonly xScaler: Scaler;
    private readonly yScaler: Scaler;

    constructor(xScaler: Scaler, yScaler: Scaler) {
        this.xScaler = xScaler;
        this.yScaler = yScaler;
    }

    public scale(point: Point2D): Point2D {
        return new Point2D(this.xScaler.scale(point.x), this.yScaler.scale(point.y));
    }

    public unscale(point: Point2D): Point2D {
        return new Point2D(this.xScaler.unscale(point.x), this.yScaler.unscale(point.y));
    }
}