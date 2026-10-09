import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
export declare function getLastDayOfMonth<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): TheDate;
