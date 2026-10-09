import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
import type * as DArray from '../array';
export declare function minDate<GenericDates extends (TheDate | SerializedTheDate)[]>(dates: GenericDates & DArray.RequireAtLeastElements<GenericDates, 1>): TheDate;
