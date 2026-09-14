import type * as DCommon from "@scripts/common";

type OverrideParameter<
	GenericValue extends object,
> = DCommon.IsUnion<GenericValue> extends true
	? undefined
	: Partial<GenericValue>;

export function override<
	GenericObject extends object,
>(
	value: OverrideParameter<GenericObject>,
): (
	object: GenericObject,
) => GenericObject;

export function override<
	GenericObject extends object,
>(
	object: GenericObject,
	value: OverrideParameter<GenericObject>,
): GenericObject;

export function override(
	...args:
		| [value: object | undefined]
		| [object: object, value: object | undefined]
) {
	if (args.length === 1) {
		const [value] = args;

		return (object: object) => override(object, value as never);
	}

	const [object, value] = args;

	return Object.entries(value ?? {})
		.reduce(
			(acc, [key, value]) => {
				if (value !== undefined) {
					acc[key as never] = value as never;
				}

				return acc;
			},
			{ ...object },
		);
}
