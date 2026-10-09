import { TheTime } from './theTime';
import { SerializedTheTime } from './types';
export declare function formatTime<GenericTime extends TheTime | SerializedTheTime, GenericFormat extends string>(formatString: GenericFormat): (time: GenericTime) => string;
export declare function formatTime<GenericTime extends TheTime | SerializedTheTime, GenericFormat extends string>(time: GenericTime, formatString: GenericFormat): string;
