import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function addMilliseconds<GenericDate extends TheDate | SerializedTheDate, GenericMillisecond extends number>(millisecond: GenericMillisecond): (date: GenericDate) => TheDate;
export declare function addMilliseconds<GenericDate extends TheDate | SerializedTheDate, GenericMillisecond extends number>(date: GenericDate, millisecond: GenericMillisecond): TheDate;
