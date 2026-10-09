import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function addYears<GenericDate extends TheDate | SerializedTheDate, GenericYear extends number>(year: GenericYear): (date: GenericDate) => TheDate;
export declare function addYears<GenericDate extends TheDate | SerializedTheDate, GenericYear extends number>(date: GenericDate, year: GenericYear): TheDate;
