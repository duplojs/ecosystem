import { TheTime } from '../theTime';
import { SerializedTheTime } from '../types';
export declare function equalTime(second: TheTime | SerializedTheTime): (first: TheTime | SerializedTheTime) => boolean;
export declare function equalTime(first: TheTime | SerializedTheTime, second: TheTime | SerializedTheTime): boolean;
