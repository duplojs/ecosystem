import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
export interface ClosestToParams {
    tieBreaker?: "favorPast" | "favorFuture";
}
export declare function closestTo(targetDate: TheDate | SerializedTheDate, params?: ClosestToParams): (dates: Iterable<TheDate | SerializedTheDate>) => TheDate | undefined;
export declare function closestTo(dates: Iterable<TheDate | SerializedTheDate>, targetDate: TheDate | SerializedTheDate, params?: ClosestToParams): TheDate | undefined;
