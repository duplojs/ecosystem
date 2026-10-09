import { TheDate } from '../theDate';
import { TheTime } from '../theTime';
import { SerializedTheDate, SerializedTheTime } from '../types';
export declare function addTime<GenericInput extends (TheDate | SerializedTheDate | TheTime | SerializedTheTime)>(time: TheTime | SerializedTheTime): (input: GenericInput) => (GenericInput extends (TheDate | SerializedTheDate) ? TheDate : GenericInput extends (TheTime | SerializedTheTime) ? TheTime : never);
export declare function addTime<GenericInput extends (TheDate | SerializedTheDate | TheTime | SerializedTheTime)>(input: GenericInput, time: TheTime | SerializedTheTime): (GenericInput extends (TheDate | SerializedTheDate) ? TheDate : GenericInput extends (TheTime | SerializedTheTime) ? TheTime : never);
