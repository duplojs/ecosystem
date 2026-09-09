import type { At } from "./types";

export function at<
	GenericString extends string,
	GenericIndex extends number,
>(
	index: GenericIndex,
): (
	string: GenericString,
) => GenericString extends string
	? At<GenericString, GenericIndex>
	: never;

export function at<
	GenericString extends string,
	GenericIndex extends number,
>(
	string: GenericString,
	index: GenericIndex,
): GenericString extends string
	? At<GenericString, GenericIndex>
	: never;

export function at(
	...args:
		| [index: number]
		| [string: string, index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (string: string) => at(string, index);
	}

	const [string, index] = args;

	return string.at(index);
}
