import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
export declare function getFirstDayOfWeek<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): TheDate;
