import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function betweenThanOrEqualDate<GenericDate extends TheDate | SerializedTheDate>(greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate): (date: GenericDate) => boolean;
export declare function betweenThanOrEqualDate<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate, greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate): boolean;
