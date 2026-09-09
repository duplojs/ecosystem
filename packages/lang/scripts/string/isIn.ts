export function isIn<
	GenericValue extends string,
>(
	array: readonly (GenericValue | string)[],
): (
	string: string,
) => string is GenericValue;

export function isIn<
	GenericValue extends string,
>(
	string: string,
	array: readonly (GenericValue | string)[],
): string is GenericValue;

export function isIn(
	...args:
		| [array: readonly string[]]
		| [string: string, array: readonly string[]]
) {
	if (args.length === 1) {
		const [array] = args;

		return (string: string) => isIn(string, array);
	}

	const [string, array] = args;

	return array.includes(string);
}
