import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function addDays<GenericDate extends TheDate | SerializedTheDate, GenericDay extends number>(day: GenericDay): (date: GenericDate) => TheDate;
export declare function addDays<GenericDate extends TheDate | SerializedTheDate, GenericDay extends number>(date: GenericDate, day: GenericDay): TheDate;
