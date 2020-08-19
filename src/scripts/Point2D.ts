export class Point2D {
    public x: number;
    public y: number;
    public 0: number;
    public 1: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        // Also let's this object be treated like an array
        this[0] = x;
        this[1] = y;
    }
}