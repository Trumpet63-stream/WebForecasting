import {Parser} from "../../src/scripts/Parser";

export class FakeCSVParser implements Parser {
    private returnData: string[][];

    constructor(returnData: string[][]) {
        this.returnData = returnData;
    }

    parse(string: string): string[][] {
        return this.returnData;
    }
}