import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function subtractWeeks<GenericDate extends TheDate | SerializedTheDate, GenericWeek extends number>(week: GenericWeek): (date: GenericDate) => TheDate;
export declare function subtractWeeks<GenericDate extends TheDate | SerializedTheDate, GenericWeek extends number>(date: GenericDate, week: GenericWeek): TheDate;
