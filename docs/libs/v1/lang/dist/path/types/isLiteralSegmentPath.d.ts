import type * as DCommon from '../../common';
import type * as DString from '../../string';
export type IsLiteralSegmentPath<GenericValue extends string> = DString.IsLiteral<GenericValue> extends true ? DCommon.Not<DCommon.Or<[
    DCommon.IsEqual<GenericValue, ".">,
    DCommon.IsEqual<GenericValue, "..">,
    DCommon.IsEqual<GenericValue, "">,
    DString.Includes<GenericValue, "/">,
    DString.Includes<GenericValue, "\0">
]>> : false;
