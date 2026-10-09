import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function lessThanOrEqualDate<GenericDate extends TheDate | SerializedTheDate>(threshold: TheDate | SerializedTheDate): (date: GenericDate) => boolean;
export declare function lessThanOrEqualDate<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate, threshold: TheDate | SerializedTheDate): boolean;
