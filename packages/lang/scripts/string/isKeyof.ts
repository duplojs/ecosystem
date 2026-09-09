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

	return object[key as never] !== undefined;
}
