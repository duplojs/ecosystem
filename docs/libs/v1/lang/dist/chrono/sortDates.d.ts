import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
import type * as DArray from '../array';
import type * as DCommon from '../common';
export declare function sortDates<GenericDates extends readonly (TheDate | SerializedTheDate)[]>(type: DCommon.SortType): (dates: GenericDates & DArray.RequireAtLeastElements<GenericDates, 1>) => TheDate[];
export declare function sortDates<GenericDates extends readonly (TheDate | SerializedTheDate)[]>(dates: GenericDates & DArray.RequireAtLeastElements<GenericDates, 1>, type: DCommon.SortType): TheDate[];
