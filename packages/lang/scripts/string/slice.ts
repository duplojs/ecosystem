import type { ReapplyAllowedCharacters, ReapplyCompatiblesConstraints } from "./constraints";

type SliceOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyAllowedCharacters<
		GenericString,
		ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">
	>
	: never;

export function slice<
	GenericString extends string,
>(
	start: number,
	end: number,
): (
	string: GenericString,
) => SliceOutput<GenericString>;

export function slice<
	GenericString extends string,
>(
	string: GenericString,
	start: number,
	end: number,
): SliceOutput<GenericString>;

export function slice(
	...args:
		| [start: number, end: number]
		| [string: string, start: number, end: number]
) {
	if (args.length === 2) {
		const [start, end] = args;

		return (string: string) => slice(string, start, end);
	}

	const [string, start, end] = args;

	return string.slice(start, end);
}
