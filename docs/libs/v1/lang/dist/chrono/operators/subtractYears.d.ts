import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function subtractYears<GenericDate extends TheDate | SerializedTheDate, GenericYear extends number>(year: GenericYear): (date: GenericDate) => TheDate;
export declare function subtractYears<GenericDate extends TheDate | SerializedTheDate, GenericYear extends number>(date: GenericDate, year: GenericYear): TheDate;
