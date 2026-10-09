import { TheDate } from './theDate';
import { TheTime } from './theTime';
import { SerializedTheDate, SerializedTheTime } from './types';
export declare function toNative<GenericInput extends TheDate | SerializedTheDate>(input: GenericInput): Date;
export declare function toNative<GenericInput extends TheTime | SerializedTheTime>(input: GenericInput): number;
