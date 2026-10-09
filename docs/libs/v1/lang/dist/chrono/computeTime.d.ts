import { TheTime } from './theTime';
import { SerializedTheTime } from './types';
export type ComputeTimeUnit = "week" | "day" | "hour" | "minute" | "second" | "millisecond";
export declare function computeTime<GenericTime extends TheTime | SerializedTheTime>(unit: ComputeTimeUnit): (time: GenericTime) => number;
export declare function computeTime(time: TheTime | SerializedTheTime, unit: ComputeTimeUnit): number;
