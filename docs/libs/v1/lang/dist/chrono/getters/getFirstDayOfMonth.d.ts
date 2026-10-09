import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
export declare function getFirstDayOfMonth<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): TheDate;
