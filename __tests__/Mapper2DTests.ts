import {Space2D} from "../src/scripts/Space2D";
import {Mapper2D} from "../src/scripts/Mapper2D";
import {Point2D} from "../src/scripts/Point2D";

it("maps in a reversible way", () => {
    let graphSpace = new Space2D(-10, 15, 0, 60);
    let pixelSpace = new Space2D(0, 1080, 0, 720);
    let mapper: Mapper2D = new Mapper2D(graphSpace, pixelSpace);
    let backwardMapper: Mapper2D = new Mapper2D(pixelSpace, graphSpace);
    let graphSample: Point2D[] = sampleSpace(graphSpace);
    for (let i = 0; i < graphSample.length; i++) {
        expect(mapper.graphToPixel(graphSample[i])).toEqual(backwardMapper.pixelToGraph(graphSample[i]));
    }
});

function sampleSpace(space: Space2D): Point2D[] {
    let points: Point2D[] = [];
    let xInc = (space.xMax - space.xMin) / 10;
    let yInc = (space.yMax - space.yMin) / 10;
    for(let x = space.xMin; x <= space.xMax; x += xInc) {
        for(let y = space.yMin; y <= space.yMax; y += yInc) {
            points.push(new Point2D(x, y));
        }
    }
    return points;
}

it("performs mapping accurately", () => {
    let graphSpace = new Space2D(-10, 15, 0, 60);
    let pixelSpace = new Space2D(0, 1080, 0, 720);
    let mapper: Mapper2D = new Mapper2D(graphSpace, pixelSpace);
    let point: Point2D = new Point2D(200, 47);
    let expectedPoint: Point2D = new Point2D(25/1080*200, 60/720*(720-47));
    expect(mapper.pixelToGraph(point)).toEqual(expectedPoint);
});

it("passes sanity check", () => {
    let graphSpace = new Space2D(-10, 15, 0, 60);
    let pixelSpace = new Space2D(0, 1080, 0, 720);
    let mapper: Mapper2D = new Mapper2D(graphSpace, pixelSpace);
    let point: Point2D = new Point2D(200, 47);
    let wrongPoint: Point2D = new Point2D(4.6, 3.9);
    expect(mapper.pixelToGraph(point)).not.toEqual(wrongPoint);
});