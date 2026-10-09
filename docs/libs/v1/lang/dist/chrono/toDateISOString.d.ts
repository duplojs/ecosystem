import { TheDate } from './theDate';
import { SerializedTheDate } from './types';
export declare function toDateISOString<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate): string;
