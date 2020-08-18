import {Space2D} from "./Space2D";
import {Point2D} from "./Point2D";

export class Mapper2D {
    private graphSpace: Space2D;
    private pixelSpace: Space2D;

    public constructor(graphSpace: Space2D, pixelSpace: Space2D) {
        this.graphSpace = graphSpace;
        this.pixelSpace = pixelSpace;
    }

    public pixelToGraph(p: Point2D): Point2D {
        p = this.invertY(p);
        let mappedX = Mapper2D.mapValue(this.pixelSpace.xMin, this.pixelSpace.xMax,
            this.graphSpace.xMin, this.graphSpace.xMax, p.x);
        let mappedY = Mapper2D.mapValue(this.pixelSpace.yMin, this.pixelSpace.yMax,
            this.graphSpace.yMin, this.graphSpace.yMax, p.y);
        return new Point2D(mappedX, mappedY);
    }

    public graphToPixel(p: Point2D): Point2D {
        let mappedX = Mapper2D.mapValue(this.graphSpace.xMin, this.graphSpace.xMax,
            this.pixelSpace.xMin, this.pixelSpace.xMax, p.x);
        let mappedY = Mapper2D.mapValue(this.graphSpace.yMin, this.graphSpace.yMax,
            this.pixelSpace.yMin, this.pixelSpace.yMax, p.y);
        return this.invertY(new Point2D(mappedX, mappedY));
    }

    private invertY(p: Point2D): Point2D {
        return new Point2D(p.x, this.pixelSpace.yMax - p.y);
    }

    private static mapValue(fromMin: number, fromMax: number, toMin: number, toMax: number, value: number): number {
        return (toMax - toMin) / (fromMax - fromMin) * value;
    }
}