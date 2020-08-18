import {GridLines} from "../src/scripts/GridLines";

it("gives reasonable values", () => {
    expectPracticallyEqual(
        GridLines.ofRange(19.59, 38.47).values, getRange(18, 39, 3)
    );
    expectPracticallyEqual(
        GridLines.ofRange(40.53, 72.5).values, getRange(40, 75, 5)
    );
    expectPracticallyEqual(
        GridLines.ofRange(64.57, 103.3).values, getRange(64, 104, 8)
    );
    expectPracticallyEqual(
        GridLines.ofRange(19.65, 255.5).values, getRange(0, 260, 20)
    );
});

it("works with single data points", () => {
    expectPracticallyEqual(
        GridLines.ofRange(1, 1).values, getRange(0.8, 1.1, 0.1)
    );
    expectPracticallyEqual(
        GridLines.ofRange(-1, -1).values, getRange(-1.2, -0.9, 0.1)
    );
    expectPracticallyEqual(
        GridLines.ofRange(0, 0).values, getRange(-0.0002, 0.0001, 0.0001)
    );
});

it("handles scaling properly", () => {
    expectPracticallyEqual(
        GridLines.ofRange(0.1959, 0.3847).values, getRange(0.18, 0.39, 0.03)
    );
    expectPracticallyEqual(
        GridLines.ofRange(1.959, 3.847).values, getRange(1.8, 3.9, 0.3)
    );
    expectPracticallyEqual(
        GridLines.ofRange(19.59, 38.47).values, getRange(18, 39, 3)
    );
    expectPracticallyEqual(
        GridLines.ofRange(195.9, 384.7).values, getRange(180, 390, 30)
    );
    expectPracticallyEqual(
        GridLines.ofRange(1959, 3847).values, getRange(1800, 3900, 300)
    );
});

it("always generates a valid number of values", () => {
    let max = 1000000000;
    for (let i = 0; i < 1000; i++) {
        let numLines: number = GridLines.ofRange(0, max).values.length;
        expect(numLines).toBeGreaterThanOrEqual(GridLines.minLines);
        expect(numLines).toBeLessThanOrEqual(GridLines.maxLines);
        max *= 0.9;
    }
});

function expectPracticallyEqual(a1: number[], a2: number[]) {
    if (!practicallyEqual(a1, a2)) {
        console.log("a1 = ");
        console.log(a1);
        console.log("a2 = ");
        console.log(a2);
    }
    expect(practicallyEqual(a1, a2)).toBe(true);
}

function getRange(min: number, max: number, increment: number): number[] {
    let numMultiples: number = Math.round((max - min) / increment);
    let range: number[] = [];
    for (let i = 0; i <= numMultiples; i++) {
        range.push(min + i * increment);
    }
    return range;
}

function practicallyEqual(a1: number[], a2: number[]): boolean {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        let difference = a1[i] - a2[i];
        if (Math.abs(difference) > 0.0000001 || isNaN(difference)) {
            console.log("a1 = " + a1[i] + ", a2 = " + a2[i]);
            return false;
        }
    }
    return true;
}