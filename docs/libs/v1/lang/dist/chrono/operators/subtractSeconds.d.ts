import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function subtractSeconds<GenericDate extends TheDate | SerializedTheDate, GenericSecond extends number>(second: GenericSecond): (date: GenericDate) => TheDate;
export declare function subtractSeconds<GenericDate extends TheDate | SerializedTheDate, GenericSecond extends number>(date: GenericDate, second: GenericSecond): TheDate;
