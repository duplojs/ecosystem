import { TheDate } from './theDate';
import { TheTime } from './theTime';
import { SerializedTheDate } from './types';
export declare function getDifference(referenceDate: TheDate | SerializedTheDate): (date: TheDate | SerializedTheDate) => TheTime;
export declare function getDifference(date: TheDate | SerializedTheDate, referenceDate: TheDate | SerializedTheDate): TheTime;
