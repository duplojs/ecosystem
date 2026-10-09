import { TheDate } from './theDate';
import { Unit, SerializedTheDate } from './types';
export declare function eachDate(range: {
    start: TheDate | SerializedTheDate;
    end: TheDate | SerializedTheDate;
}, unit?: Unit): Generator<TheDate, unknown, unknown>;
