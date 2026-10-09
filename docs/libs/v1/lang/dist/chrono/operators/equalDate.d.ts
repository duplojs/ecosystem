import { TheDate } from '../theDate';
import { SerializedTheDate } from '../types';
export declare function equalDate(second: TheDate | SerializedTheDate): (first: TheDate | SerializedTheDate) => boolean;
export declare function equalDate(first: TheDate | SerializedTheDate, second: TheDate | SerializedTheDate): boolean;
