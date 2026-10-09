import { TheTime } from './theTime';
import { SerializedTheTime } from './types';
import type * as DArray from '../array';
export declare function minTime<GenericTimes extends (TheTime | SerializedTheTime)[]>(times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>): TheTime;
