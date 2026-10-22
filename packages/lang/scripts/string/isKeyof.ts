import type * as DCommon from "@scripts/common";

export function isKeyof<
	GenericObject extends object,
	GenericKey extends DCommon.ObjectKey,
>(
	object: GenericObject,
): (
	key: GenericKey,
) => key is keyof GenericObject & GenericKey;

export function isKeyof<
	GenericObject extends object,
	GenericKey extends DCommon.ObjectKey,
>(
	key: GenericKey,
	object: GenericObject,
): key is keyof GenericObject & GenericKey;

export function isKeyof(
	...args:
		| [object: object]
		| [key: DCommon.ObjectKey, object: object]
): any {
	if (args.length === 1) {
		const [object] = args;

		return (key: DCommon.ObjectKey) => isKeyof(key, object);
	}

	const [key, object] = args;

	// Keys from Object.prototype are accepted only when redefined on the object
	// or a custom prototype. This preserves useful keyof narrowing, but remains
	// a runtime heuristic: erased TypeScript types cannot be checked exactly.
	if (!Object.hasOwn(Object.prototype, key)) {
		return key in object;
	}

	let current: object | null = object;

	while (current !== null) {
		if (Object.hasOwn(current, key)) {
			return true;
		}

		current = Object.getPrototypeOf(current) as object | null;

		if (current === Object.prototype) {
			return false;
		}
	}

	return false;
}
