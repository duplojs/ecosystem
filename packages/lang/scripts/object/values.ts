import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";

export function values<
	GenericObject extends Record<string, DCommon.AnyValue>,
>(
	object: GenericObject,
): GenericObject[keyof GenericObject][];

export function values(
	object: Record<string, DCommon.AnyValue>,
): DCommon.AnyValue[] {
	return Object.entries(object)
		.filter(
			([key]) => !DKind.isRuntimeKey(key),
		)
		.map(([, value]) => value);
}
