import type * as DCommon from "@scripts/common";

export function entry<
	GenericKey extends DCommon.ObjectKey,
	GenericValue extends unknown,
>(
	key: GenericKey,
	value: GenericValue,
): readonly [GenericKey, GenericValue];

export function entry(
	key: DCommon.ObjectKey,
	value: unknown,
): readonly [DCommon.ObjectKey, unknown] {
	return [key, value] as const;
}
