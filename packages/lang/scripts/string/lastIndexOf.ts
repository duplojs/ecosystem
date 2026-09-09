export function lastIndexOf<
	GenericString extends string,
>(
	searchString: string,
): (
	string: GenericString,
) => number | undefined;

export function lastIndexOf<
	GenericString extends string,
>(
	string: GenericString,
	searchString: string,
	position?: number,
): number | undefined;

export function lastIndexOf(
	...args:
		| [searchString: string]
		| [string: string, searchString: string, position?: number]
) {
	if (args.length === 1) {
		const [searchString] = args;

		return (string: string) => lastIndexOf(string, searchString);
	}

	const [string, searchString, position] = args;

	const result = string.lastIndexOf(searchString, position);
	return result === -1 ? undefined : result;
}
