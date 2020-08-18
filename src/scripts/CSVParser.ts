import * as CSV from 'csv-string';
import {Parser} from "./Parser";

export class CSVParser implements Parser {
    public parse(string: string): string[][] {
        return <string[][]> CSV.parse(string);
    }
}