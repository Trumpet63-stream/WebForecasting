import {Point2D} from "./Point2D";

export class Rectangle {
    public width: number;
    public height: number;
    public topLeftX: number;
    public topLeftY: number;
    public centerX: number;
    public centerY: number;
    public center: Point2D;
    public topLeft: Point2D;

    private constructor() {
    }

    public static ofTopLeft(x: number, y: number, width: number, height: number): Rectangle {
        let rect = new Rectangle();
        rect.width = width;
        rect.height = height;
        rect.topLeftX = x;
        rect.topLeftY = y;
        rect.topLeft = new Point2D(rect.topLeftX, rect.topLeftY);
        rect.centerX = x + width / 2;
        rect.centerY = y + height / 2;
        rect.center = new Point2D(rect.centerX, rect.centerY);
        return rect;
    }

    public static ofCenter(x: number, y: number, width: number, height: number): Rectangle {
        let rect = new Rectangle();
        rect.width = width;
        rect.height = height;
        rect.topLeftX = x - width / 2;
        rect.topLeftY = y - height / 2;
        rect.topLeft = new Point2D(rect.topLeftX, rect.topLeftY);
        rect.centerX = x;
        rect.centerY = y;
        rect.center = new Point2D(rect.centerX, rect.centerY);
        return rect;
    }
}