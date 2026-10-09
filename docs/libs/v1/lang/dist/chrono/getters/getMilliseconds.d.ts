import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
export declare function getMilliseconds<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): number;
