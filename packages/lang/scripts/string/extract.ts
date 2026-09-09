export interface ExtractOutput<
	GenericString extends string = string,
> {
	matchedValue: string;
	groups: string[];
	namedGroups: Record<string, string | undefined>;
	offset: number;
	self: GenericString;
}

export function extract<
	GenericString extends string,
>(
	pattern: string | RegExp,
): (
	string: GenericString,
) => ExtractOutput<GenericString> | undefined;

export function extract<
	GenericString extends string,
>(
	string: GenericString,
	pattern: string | RegExp,
): ExtractOutput<GenericString> | undefined;

export function extract(
	...args:
		| [pattern: string | RegExp]
		| [string: string, pattern: string | RegExp]
): any {
	if (args.length === 1) {
		const [pattern] = args;

		return (string: string) => extract(string, pattern);
	}

	const [string, pattern] = args;

	const result = string.match(pattern);

	if (!result) {
		return undefined;
	}

	return {
		matchedValue: result[0],
		groups: result.slice(1),
		namedGroups: result.groups ? { ...result.groups } : {},
		offset: result.index ?? 0,
		self: result.input ?? string,
	};
}
