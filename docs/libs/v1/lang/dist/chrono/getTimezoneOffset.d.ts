import { Timezone } from './timezone';
import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
export declare function getTimezoneOffset(timeZone: Timezone): (date: TheDate | SerializedTheDate) => number;
export declare function getTimezoneOffset(date: TheDate | SerializedTheDate, timeZone: Timezone): number;
