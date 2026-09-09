import type * as DCommon from "@scripts/common";
import type { RequiredKeys } from "./types";

export function hasKeys<
	GenericObject extends object,
	GenericKeys extends keyof GenericObject,
>(
	keys: GenericKeys | readonly GenericKeys[],
): (
	partialObject: GenericObject,
) => partialObject is RequiredKeys<GenericObject, NoInfer<GenericKeys>>;

export function hasKeys<
	GenericObject extends object,
	GenericKeys extends keyof GenericObject,
>(
	partialObject: GenericObject,
	keys: GenericKeys | readonly GenericKeys[],
): partialObject is RequiredKeys<GenericObject, NoInfer<GenericKeys>>;

export function hasKeys(
	...args:
		| [keys: DCommon.ObjectKey | readonly DCommon.ObjectKey[]]
		| [partialObject: object, keys: DCommon.ObjectKey | readonly DCommon.ObjectKey[]]
): any {
	if (args.length === 1) {
		const [keys] = args;

		return (partialObject: object) => hasKeys(partialObject, keys as never);
	}
	const [partialObject, keys] = args;

	const formattedKey: readonly PropertyKey[] = Array.isArray(keys) ? keys : [keys];
	const indexedPartialObject = partialObject as Record<DCommon.ObjectKey, unknown>;

	for (const key of formattedKey) {
		if (indexedPartialObject[key] === undefined) {
			return false;
		}
	}

	return true;
}
