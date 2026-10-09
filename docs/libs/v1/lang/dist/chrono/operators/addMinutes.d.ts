import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function addMinutes<GenericDate extends TheDate | SerializedTheDate, GenericMinute extends number>(minute: GenericMinute): (date: GenericDate) => TheDate;
export declare function addMinutes<GenericDate extends TheDate | SerializedTheDate, GenericMinute extends number>(date: GenericDate, minute: GenericMinute): TheDate;
