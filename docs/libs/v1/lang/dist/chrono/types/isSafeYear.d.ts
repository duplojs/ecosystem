import type * as DCommon from '../../common';
import type * as DNumber from '../../number';
export type IsSafeYear<GenericYears extends number> = DCommon.And<[
    DNumber.IsGreaterOrEqual<GenericYears, -271820>,
    DNumber.IsLessOrEqual<GenericYears, 275759>
]>;
