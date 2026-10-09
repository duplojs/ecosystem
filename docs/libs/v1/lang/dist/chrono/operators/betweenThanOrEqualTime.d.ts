import { TheTime } from '../theTime';
import { SerializedTheTime } from '../types';
export declare function betweenThanOrEqualTime<GenericTime extends TheTime | SerializedTheTime>(greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime): (time: GenericTime) => boolean;
export declare function betweenThanOrEqualTime<GenericTime extends TheTime | SerializedTheTime>(time: GenericTime, greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime): boolean;
