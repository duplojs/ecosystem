import { TheTime } from '../theTime';
import { SerializedTheTime } from '../types';
export declare function lessThanOrEqualTime<GenericTime extends TheTime | SerializedTheTime>(threshold: TheTime | SerializedTheTime): (time: GenericTime) => boolean;
export declare function lessThanOrEqualTime<GenericTime extends TheTime | SerializedTheTime>(time: GenericTime, threshold: TheTime | SerializedTheTime): boolean;
