import type * as DCommon from "@scripts/common";

export type Coalescing<
	GenericValue extends unknown,
> = GenericValue extends readonly any[]
	? GenericValue
	: readonly [GenericValue];

export function coalescing<
	GenericValue extends DCommon.AnyValue,
>(
	value: GenericValue,
): Coalescing<GenericValue>;

export function coalescing(
	value: DCommon.AnyValue,
) {
	return value instanceof Array
		? value
		: [value];
}
