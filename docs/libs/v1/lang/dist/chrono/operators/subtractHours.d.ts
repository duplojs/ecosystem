import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function subtractHours<GenericDate extends TheDate | SerializedTheDate, GenericHour extends number>(hour: GenericHour): (date: GenericDate) => TheDate;
export declare function subtractHours<GenericDate extends TheDate | SerializedTheDate, GenericHour extends number>(date: GenericDate, hour: GenericHour): TheDate;
