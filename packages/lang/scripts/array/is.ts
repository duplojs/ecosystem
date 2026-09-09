import type * as DCommon from "@scripts/common";

type IsOutput<
	GenericValue extends unknown,
> = DCommon.IsEqual<Extract<GenericValue, readonly unknown[]>, never> extends true
	? GenericValue & readonly unknown[]
	: Extract<GenericValue, readonly unknown[]>;

export function is<
	GenericValue extends unknown,
>(
	value: GenericValue,
): value is IsOutput<GenericValue> {
	return value instanceof Array;
}
