import { TheDate } from './theDate';
import { Hour, IsLeapYear, IsSafeYear, Millisecond, Minute, Second, MonthWithDay, SpoolingDate, SerializedTheDate } from './types';
import * as DEither from '../either';
import type * as DCommon from '../common';
import type * as DString from '../string';
export type MayBeDate = DEither.Right<"date-created", TheDate> | DEither.Left<"date-created-error", null>;
type SafeDate = `${number}-${MonthWithDay}`;
type ForbiddenDate<GenericDate extends string> = DCommon.And<[
    DCommon.IsExtends<GenericDate, SafeDate>,
    DCommon.Not<DCommon.IsEqual<GenericDate, SafeDate>>
]> extends true ? ((DString.Includes<GenericDate, "."> extends true ? DCommon.ComputedTypeError<"Year can't be includes a float number."> : GenericDate) & (GenericDate extends `${infer InferredYear extends number}-02-29` ? IsLeapYear<InferredYear> extends true ? GenericDate : DCommon.ComputedTypeError<"Is not a leap year."> : GenericDate) & (GenericDate extends `${infer InferredYear extends number}-${MonthWithDay}` ? IsSafeYear<InferredYear> extends true ? GenericDate : DCommon.ComputedTypeError<"Support that the years between -271820 and 275759."> : GenericDate)) : GenericDate;
export interface CreateSafeDateParams {
    hour?: Hour;
    minute?: Minute;
    second?: Second;
    millisecond?: Millisecond;
}
export declare function createDate<GenericInput extends TheDate | Date | number | SerializedTheDate>(input: GenericInput): MayBeDate;
export declare function createDate<GenericInput extends SpoolingDate>(input: GenericInput): MayBeDate;
export declare function createDate<GenericInput extends SafeDate>(input: GenericInput & ForbiddenDate<GenericInput>, params?: CreateSafeDateParams): TheDate;
export {};
