import type * as DCommon from "@scripts/common";

type TransformPropertyOutput<
	GenericObject extends object,
	GenericKey extends keyof GenericObject,
	GenericNewValue extends unknown,
> = DCommon.SimplifyTopLevel<
	& { [Prop in GenericKey]: GenericNewValue }
	& Omit<GenericObject, GenericKey>
>;

export function transformProperty<
	GenericObject extends object,
	GenericKey extends keyof GenericObject,
	GenericNewValue extends unknown,
>(
	key: GenericKey,
	transform: (value: GenericObject[GenericKey]) => GenericNewValue,
): (
	object: GenericObject,
) => TransformPropertyOutput<GenericObject, GenericKey, GenericNewValue>;

export function transformProperty<
	GenericObject extends object,
	GenericKey extends keyof GenericObject,
	GenericNewValue extends unknown,
>(
	object: GenericObject,
	key: GenericKey,
	transform: (value: GenericObject[GenericKey]) => GenericNewValue,
): TransformPropertyOutput<GenericObject, GenericKey, GenericNewValue>;

export function transformProperty(
	...args:
		| [key: DCommon.ObjectKey, transform: DCommon.AnyFunction]
		| [object: object, key: DCommon.ObjectKey, transform: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [key, transform] = args;

		return (object: object) => transformProperty(object, key as never, transform as never);
	}

	const [object, key, transform] = args;
	const indexedObject = object as Record<DCommon.ObjectKey, unknown>;

	return {
		...object,
		[key]: transform(indexedObject[key]),
	};
}

