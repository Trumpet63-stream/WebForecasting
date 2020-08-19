import {Point2D} from "./Point2D";
import {Rectangle} from "./Rectangle";

export abstract class Points {
    public static getEnclosingRectangle(points: Point2D[]): Rectangle {
        return Rectangle.ofTopLeft(0, 0, 0, 0);
    }
}