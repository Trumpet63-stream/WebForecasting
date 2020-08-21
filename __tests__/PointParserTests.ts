import {PointParser} from "../src/scripts/PointParser";
import {FakeCSVParser} from "../test_resources/mocks/FakeCSVParser";
import {ParsingError} from "../src/scripts/errors/ParsingError";
import {Point2D} from "../src/scripts/Point2D";

it('throws error for non-numerical y', () => {
    let nonNumericalData = [["2020-08-11", "y1"], ["2020-08-12", "y2"]];
    let fakeParser = new FakeCSVParser(nonNumericalData);
    let ignoredString = "";
    expect(() => {
        new PointParser(fakeParser).parseTimeSeries(ignoredString)
    }).toThrowError(ParsingError);
});

it('throws error for non-date x', () => {
    let nonNumericalData = [["abc", "3.14"], ["xyz", "1.01"]];
    let fakeParser = new FakeCSVParser(nonNumericalData);
    let ignoredString = "";
    expect(() => {
        new PointParser(fakeParser).parseTimeSeries(ignoredString)
    }).toThrowError(ParsingError);
});

it('throws error for more than 2 dimensions', () => {
    let moreThan2dData = [["1", "2", "3"], ["4", "5", "6"]];
    let fakeParser = new FakeCSVParser(moreThan2dData);
    let ignoredString = "";
    expect(() => {
        new PointParser(fakeParser).parseTimeSeries(ignoredString)
    }).toThrowError(ParsingError);
});

it('throws error for less than 2 dimensions', () => {
    let lessThan2dData = [["1", "2"], ["3"]];
    let fakeParser = new FakeCSVParser(lessThan2dData);
    let ignoredString = "";
    expect(() => {
        new PointParser(fakeParser).parseTimeSeries(ignoredString)
    }).toThrowError(ParsingError);
});

it('parses integers into points', () => {
    let integerData = [["2020-08-13", "2"], ["2020-08-14", "4"]];
    let fakeParser = new FakeCSVParser(integerData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1597291200000, 2), new Point2D(1597377600000, 4)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parseTimeSeries(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});

it('parses floats into points', () => {
    let floatData = [["2020-08-13", "2.3477"], ["2020-08-14", "4.567"]];
    let fakeParser = new FakeCSVParser(floatData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1597291200000, 2.3477), new Point2D(1597377600000, 4.567)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parseTimeSeries(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});

it('parses mixed integers and floats into points', () => {
    let mixedData = [["2020-08-13", "2.3477"], ["2020-08-14", "4"]];
    let fakeParser = new FakeCSVParser(mixedData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1597291200000, 2.3477), new Point2D(1597377600000, 4)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parseTimeSeries(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});

it('sorts points', () => {
    let mixedData = [["2020-08-14", "4"], ["2020-08-13", "2.3477"]];
    let fakeParser = new FakeCSVParser(mixedData);
    let ignoredString = "";
    let expectedResult: Point2D[] = [new Point2D(1597291200000, 2.3477), new Point2D(1597377600000, 4)];
    let actualResult: Point2D[] = new PointParser(fakeParser).parseTimeSeries(ignoredString);
    expect(actualResult).toEqual(expectedResult);
});