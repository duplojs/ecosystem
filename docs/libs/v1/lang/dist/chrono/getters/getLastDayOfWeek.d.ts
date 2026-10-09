import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
export declare function getLastDayOfWeek<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): TheDate;
