export function indexOf<
	GenericString extends string,
>(
	searchString: string,
): (
	string: GenericString,
) => number | undefined;

export function indexOf<
	GenericString extends string,
>(
	string: GenericString,
	searchString: string,
	position?: number,
): number | undefined;

export function indexOf(
	...args:
		| [searchString: string]
		| [string: string, searchString: string, position?: number]
) {
	if (args.length === 1) {
		const [searchString] = args;

		return (string: string) => indexOf(string, searchString);
	}

	const [string, searchString, position] = args;

	const result = string.indexOf(searchString, position);
	return result === -1 ? undefined : result;
}
