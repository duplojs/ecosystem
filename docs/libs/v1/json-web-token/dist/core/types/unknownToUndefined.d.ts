import type * as DCommon from "@duplojs-v1/lang/common";
export type UnknownToUndefined<GenericValue extends unknown> = DCommon.IsEqual<GenericValue, unknown> extends true ? undefined : GenericValue;
