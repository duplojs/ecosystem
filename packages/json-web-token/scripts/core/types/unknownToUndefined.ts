import type * as DCommon from "@duplojs/lang/common";

export type UnknownToUndefined<
	GenericValue extends unknown,
> = DCommon.IsEqual<GenericValue, unknown> extends true
	? undefined
	: GenericValue;
