import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function addMonths<GenericDate extends TheDate | SerializedTheDate, GenericMonth extends number>(month: GenericMonth): (date: GenericDate) => TheDate;
export declare function addMonths<GenericDate extends TheDate | SerializedTheDate, GenericMonth extends number>(date: GenericDate, month: GenericMonth): TheDate;
