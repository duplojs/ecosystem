import { TheDate } from './theDate';
import { Timezone } from './timezone';
import { SerializedTheDate } from './types';
export declare function formatDate<GenericDate extends TheDate | SerializedTheDate, GenericFormat extends string, GenericTimezone extends Timezone>(formatString: GenericFormat, timezone: GenericTimezone): (date: GenericDate) => string;
export declare function formatDate<GenericDate extends TheDate | SerializedTheDate, GenericFormat extends string, GenericTimezone extends Timezone>(date: GenericDate, formatString: GenericFormat, timezone: GenericTimezone): string;
