import { SerializedTheDate } from '../types';
import { TheDate } from '../theDate';
import { Timezone } from '../timezone';
export declare function getDayOfMonth<GenericDate extends TheDate | SerializedTheDate>(date: GenericDate, timezone?: Timezone): number;
