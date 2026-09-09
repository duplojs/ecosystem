import * as DKind from "@scripts/kind";

export function countKeys<
	GenericObject extends object,
>(
	object: GenericObject,
): number;

export function countKeys(
	object: object,
): number {
	return Object
		.keys(object)
		.filter(
			(key) => !DKind.isRuntimeKey(key),
		)
		.length;
}
