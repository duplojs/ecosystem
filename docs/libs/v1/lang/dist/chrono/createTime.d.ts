import { TheTime } from './theTime';
import { maxTimeValue, minTimeValue } from './constants';
import { SerializedTheTime, SpoolingTime } from './types';
import type * as DNumber from '../number';
import type * as DCommon from '../common';
import * as DEither from '../either';
export type MayBeTime = DEither.Right<"time-created", TheTime> | DEither.Left<"time-created-error", null>;
type ChronoCreateTimeUnit = "week" | "day" | "hour" | "minute" | "second" | "millisecond";
type ForbiddenTime<GenericInput extends number, GenericUnit extends ChronoCreateTimeUnit> = DCommon.IsEqual<GenericInput, number> extends true ? DCommon.ComputedTypeError<"Expect only literal value."> : ((DCommon.IsEqual<GenericUnit, "millisecond"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, typeof minTimeValue>,
    DNumber.IsLessOrEqual<GenericInput, typeof maxTimeValue>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the milliseconds between -9007199254740991 and 9007199254740991."> : GenericInput) & (DCommon.IsEqual<GenericUnit, "second"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, -9007199254740>,
    DNumber.IsLessOrEqual<GenericInput, 9007199254740>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the seconds between -9007199254740 and 9007199254740."> : GenericInput) & (DCommon.IsEqual<GenericUnit, "minute"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, -150119987579>,
    DNumber.IsLessOrEqual<GenericInput, 150119987579>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the minutes between -150119987579 and 150119987579."> : GenericInput) & (DCommon.IsEqual<GenericUnit, "hour"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, -2501999792>,
    DNumber.IsLessOrEqual<GenericInput, 2501999792>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the hours between -2501999792 and 2501999792."> : GenericInput) & (DCommon.IsEqual<GenericUnit, "day"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, -104249991>,
    DNumber.IsLessOrEqual<GenericInput, 104249991>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the days between -104249991 and 104249991."> : GenericInput) & (DCommon.IsEqual<GenericUnit, "week"> extends true ? DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericInput, -14892855>,
    DNumber.IsLessOrEqual<GenericInput, 14892855>
]> extends true ? GenericInput : DCommon.ComputedTypeError<"Support that the weeks between -14892855 and 14892855."> : GenericInput));
export declare function createTime<GenericInput extends number, GenericUnit extends ChronoCreateTimeUnit = "millisecond">(input: GenericInput & ForbiddenTime<GenericInput, GenericUnit>, unit: GenericUnit): TheTime;
export declare function createTime<GenericInput extends number | TheTime | SpoolingTime | SerializedTheTime>(input: GenericInput): MayBeTime;
export {};
