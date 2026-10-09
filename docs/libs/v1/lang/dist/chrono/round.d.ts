import { TheDate } from './theDate';
import { SerializedTheDate, Unit } from './types';
export type RoundUnit = Exclude<Unit, "millisecond">;
export declare function round(date: (TheDate | SerializedTheDate), unit?: RoundUnit): TheDate;
