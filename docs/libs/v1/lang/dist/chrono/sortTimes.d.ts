import { TheTime } from './theTime';
import { SerializedTheTime } from './types';
import type * as DArray from '../array';
import type * as DCommon from '../common';
export declare function sortTimes<GenericTimes extends readonly (TheTime | SerializedTheTime)[]>(type: DCommon.SortType): (times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>) => TheTime[];
export declare function sortTimes<GenericTimes extends readonly (TheTime | SerializedTheTime)[]>(times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>, type: DCommon.SortType): TheTime[];
