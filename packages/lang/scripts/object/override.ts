export function override<
	GenericObject extends object,
>(
	value: Partial<NoInfer<GenericObject>>,
): (
	object: GenericObject,
) => GenericObject;

export function override<
	GenericObject extends object,
>(
	object: GenericObject,
	value: Partial<NoInfer<GenericObject>>,
): GenericObject;

export function override(
	...args:
		| [value: object]
		| [object: object, value: object]
) {
	if (args.length === 1) {
		const [value] = args;

		return (object: object) => override(object, value);
	}

	const [object, value] = args;

	return Object.entries(value)
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
