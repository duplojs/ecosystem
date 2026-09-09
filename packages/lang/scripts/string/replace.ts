export interface StringReplacerParams<
	GenericString extends string = string,
> {
	matchedValue: string;
	groups: (string | undefined)[];
	namedGroups: Record<string, string | undefined>;
	offset: number;
	self: GenericString;
}

export type StringReplacer<
	GenericString extends string = string,
> = (
	params: StringReplacerParams<GenericString>,
) => string;

export function replace<
	GenericString extends string,
>(
	pattern: string | RegExp,
	replacement: string | StringReplacer<GenericString>,
): (
	string: GenericString,
) => string;

export function replace<
	GenericString extends string,
>(
	string: GenericString,
	pattern: string | RegExp,
	replacement: string | StringReplacer<GenericString>,
): string;

export function replace(
	...args:
		| [pattern: string | RegExp, replacement: string | StringReplacer]
		| [string: string, pattern: string | RegExp, replacement: string | StringReplacer]
): any {
	if (args.length === 2) {
		const [pattern, replacement] = args;

		return (string: string) => replace(string, pattern, replacement);
	}

	const [string, pattern, replacement] = args;

	if (typeof replacement === "function") {
		return string.replace(
			pattern,
			(
				matchedValue,
				...argsRest: (
					| [
						...captures: (string | undefined)[],
						offset: number,
						self: string,
					]
					| [
						...captures: (string | undefined)[],
						offset: number,
						self: string,
						namedGroups: Record<string, string | undefined>,
					]
				)
			) => {
				const namedGroups = typeof argsRest[argsRest.length - 1] === "object"
					? argsRest.pop() as Record<string, string | undefined>
					: {};

				const [offset, self] = argsRest.splice(-2, 2) as [number, string];

				return replacement({
					matchedValue,
					namedGroups,
					offset,
					self,
					groups: argsRest as (string | undefined)[],
				});
			},
		);
	}

	return string.replace(pattern, replacement);
}
