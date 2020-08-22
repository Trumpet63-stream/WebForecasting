import {Point2D} from "../src/scripts/Point2D";
import {Backtesting, ModelSupplier} from "../src/scripts/Backtesting";
import {FakeModelSupplier} from "../test_resources/fakeClasses/FakeModelSupplier";
import {FakeModel} from "../test_resources/fakeClasses/FakeModel";
import {mocked} from "ts-jest";

let mockModel = {
    predict: jest.fn((x: number) => 0)
}

let mockModelSupplier = {
    getModel: jest.fn((points: Point2D[]) => mockModel)
}

// jest.mock('../test_resources/fakeClasses/FakeModelSupplier', () => {
//     return {
//         FakeModelSupplier: jest.fn().mockImplementation(() => {
//             return {
//                 getModel: (points: Point2D[]) => {
//                 },
//             };
//         })
//     };
// });

let mockedFakeModelSupplier = mocked(FakeModelSupplier, true);

beforeEach(() => {
    // Clears the record of calls to the mock constructor function and its methods
    mockModelSupplier.getModel.mockClear();
    mockModel.predict.mockClear();
});

it("returns the right number of errors", () => {
    let oneDay: number = 86400000;
    let points: Point2D[] = [new Point2D(0, 0)];
    for (let i = 0; i < 5; i++) {
        points.push(new Point2D(points[i].x + oneDay, 0));
    }
    let errors: number[][] = Backtesting.backTest(points, new FakeModelSupplier(new FakeModel()));
    expect(errors.length).toEqual(4);
    expect(errors[0].length).toEqual(0);
    expect(errors[1].length).toEqual(3);
    expect(errors[2].length).toEqual(2);
    expect(errors[3].length).toEqual(1);
});

it("skips missing data points", () => {
    let oneDay: number = 86400000;
    let points: Point2D[] = [
        new Point2D(0, 0),
        new Point2D(oneDay, 0),
        new Point2D(2 * oneDay, 0),
        new Point2D(4 * oneDay, 0),
        new Point2D(5 * oneDay, 0),
        new Point2D(6 * oneDay, 0)
    ];
    let errors: number[][] = Backtesting.backTest(points, new FakeModelSupplier(new FakeModel()));
    expect(errors.length).toEqual(5);
    expect(errors[0].length).toEqual(0);
    expect(errors[1].length).toEqual(3);
    expect(errors[2].length).toEqual(3);
    expect(errors[3].length).toEqual(2);
    expect(errors[4].length).toEqual(1);
});

it("measures error correctly", () => {
    let oneDay: number = 86400000;
    let points: Point2D[] = [
        new Point2D(0, 0),
        new Point2D(oneDay, 1),
        new Point2D(2 * oneDay, 2),
        new Point2D(3 * oneDay, 3),
        new Point2D(4 * oneDay, 4),
        new Point2D(5 * oneDay, 5)
    ];
    let errors: number[][] = Backtesting.backTest(points, new FakeModelSupplier(new FakeModel()));
    expect(errors.length).toEqual(4);
    expect(errors[0]).toEqual([]);
    expect(errors[1]).toEqual([-3, -4, -5]);
    expect(errors[2]).toEqual([-4, -5]);
    expect(errors[3]).toEqual([-5]);
});

it("uses model supplier correctly", () => {
    let oneDay: number = 86400000;
    let point0 = new Point2D(0, 0)
    let point1 = new Point2D(oneDay, 0);
    let point2 = new Point2D(2 * oneDay, 0);
    let point4 = new Point2D(4 * oneDay, 0);
    let point5 = new Point2D(5 * oneDay, 0);
    let point6 = new Point2D(6 * oneDay, 0);
    let points: Point2D[] = [point0, point1, point2, point4, point5, point6];
    let fakeModel: FakeModel = mockModel;
    let fakeModelSupplier: ModelSupplier = mockModelSupplier;
    Backtesting.backTest(points, fakeModelSupplier);

    expect(fakeModelSupplier.getModel).toHaveBeenCalledTimes(4);
    expect(fakeModel.predict).toHaveBeenCalledTimes(9);

    expect(fakeModelSupplier.getModel).toHaveBeenNthCalledWith(1, [point0, point1, point2]);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(1, 4 * oneDay);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(2, 5 * oneDay);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(3, 6 * oneDay);

    expect(fakeModelSupplier.getModel).toHaveBeenNthCalledWith(2, [point1, point2]);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(4, 4 * oneDay);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(5, 5 * oneDay);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(6, 6 * oneDay);

    expect(fakeModelSupplier.getModel).toHaveBeenNthCalledWith(3, [point2, point4]);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(7, 5 * oneDay);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(8, 6 * oneDay);

    expect(fakeModelSupplier.getModel).toHaveBeenNthCalledWith(4, [point4, point5]);
    expect(fakeModel.predict).toHaveBeenNthCalledWith(9, 6 * oneDay);
});