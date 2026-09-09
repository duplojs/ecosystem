export function search<
	GenericString extends string,
>(
	pattern: string | RegExp,
): (
	string: GenericString,
) => number | undefined;

export function search<
	GenericString extends string,
>(
	string: GenericString,
	pattern: string | RegExp,
): number | undefined;

export function search(
	...args:
		| [pattern: string | RegExp]
		| [string: string, pattern: string | RegExp]
) {
	if (args.length === 1) {
		const [pattern] = args;

		return (string: string) => search(string, pattern);
	}

	const [string, pattern] = args;

	const result = string.search(pattern);

	return result === -1 ? undefined : result;
}
