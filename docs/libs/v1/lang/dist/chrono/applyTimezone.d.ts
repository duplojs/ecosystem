import { Timezone } from './timezone';
import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
export declare function applyTimezone(timeZone: Timezone): (date: TheDate | SerializedTheDate) => TheDate;
export declare function applyTimezone(date: TheDate | SerializedTheDate, timeZone: Timezone): TheDate;
