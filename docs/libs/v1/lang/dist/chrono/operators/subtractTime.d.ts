import { SerializedTheDate, SerializedTheTime } from '../types';
import { TheDate } from '../theDate';
import { TheTime } from '../theTime';
export declare function subtractTime<GenericInput extends TheDate | SerializedTheDate>(time: TheTime | SerializedTheTime): (input: GenericInput) => TheDate;
export declare function subtractTime<GenericInput extends TheTime | SerializedTheTime>(time: TheTime | SerializedTheTime): (input: GenericInput) => TheTime;
export declare function subtractTime<GenericInput extends TheDate | SerializedTheDate>(input: GenericInput, time: TheTime | SerializedTheTime): TheDate;
export declare function subtractTime<GenericInput extends TheTime | SerializedTheTime>(input: GenericInput, time: TheTime | SerializedTheTime): TheTime;
