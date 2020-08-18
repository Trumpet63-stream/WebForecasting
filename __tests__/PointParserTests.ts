import {PointParser} from "../src/scripts/PointParser";
import {FakeCSVParser} from "../test_resources/mocks/FakeCSVParser";
import {ParsingError} from "../src/scripts/errors/ParsingError";
import {Point2D} from "../src/scripts/Point2D";

it('throws error for non-numerical data', () => {
    let nonNumericalData = [["x1", "y1"], ["x2", "y2"]];
    let fakeParser = new FakeCSVParser(nonNumericalData);
    let ignoredString = "";
    expect(() => {new PointParser(fakeParser).parse(ignoredString)}).toThrowError(ParsingError);
});

it('throws error more than 2 dimensions', () => {
    let moreThan2dData = [["1", "2", "3"], ["4", "5", "6"]];
    let fakeParser = new FakeCSVParser(moreThan2dData);
    let ignoredString = "";
    expect(() => {new PointParser(fakeParser).parse(ignoredString)}).toThrowError(ParsingError);
});

it('throws error for less than 2 dimensions', () => {
    let lessThan2dData = [["1", "2"], ["3"]];
    let fakeParser = new FakeCSVParser(lessThan2dData);
    let ignoredString = "";
    expect(() => {new PointParser(fakeParser).parse(ignoredString)}).toThrowError(ParsingError);
});

it('parses integers into points', () => {
    let integerData = [["1", "2"], ["3", "4"]];
    let fakeParser = new FakeCSVParser(integerData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1, 2), new Point2D(3, 4)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parse(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});

it('parses floats into points', () => {
    let floatData = [["1.230", "2.3477"], ["3.495", "4.567"]];
    let fakeParser = new FakeCSVParser(floatData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1.23, 2.3477), new Point2D(3.495, 4.567)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parse(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});

it('parses mixed integers and floats into points', () => {
    let mixedData = [["1", "2.3477"], ["3.495", "4"], ["5", "6"], ["7.78", "8.012"]];
    let fakeParser = new FakeCSVParser(mixedData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [
        new Point2D(1, 2.3477),
        new Point2D(3.495, 4),
        new Point2D(5, 6),
        new Point2D(7.78, 8.012)
    ];
    let actualResult: Point2D[] = new PointParser(fakeParser).parse(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});
