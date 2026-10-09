import { TheTime } from '../theTime';
import { SerializedTheTime } from '../types';
export declare function betweenThanTime<GenericTime extends TheTime | SerializedTheTime>(greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime): (time: GenericTime) => boolean;
export declare function betweenThanTime<GenericTime extends TheTime | SerializedTheTime>(time: GenericTime, greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime): boolean;
