import type { Join } from "./types";

export function join<
	GenericStrings extends readonly string[],
	GenericSeparator extends string,
>(
	separator: GenericSeparator,
): (
	strings: GenericStrings,
) => Join<GenericStrings, GenericSeparator>;

export function join<
	GenericStrings extends readonly string[],
	GenericSeparator extends string,
>(
	strings: GenericStrings,
	separator: GenericSeparator,
): Join<GenericStrings, GenericSeparator>;

export function join(
	...args:
		| [separator: string]
		| [strings: readonly string[], separator: string]
) {
	if (args.length === 1) {
		const [separator] = args;

		return (strings: readonly string[]) => join(strings, separator);
	}

	const [strings, separator] = args;

	return strings.join(separator);
}
