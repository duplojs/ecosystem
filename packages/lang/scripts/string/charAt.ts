import type * as DNumber from "@scripts/number";
import type { CharactersRange, AllowedCharacters, MaxCharacters } from "./constraints";

type CharAtOutput<
	GenericString extends string,
> = GenericString extends AllowedCharacters<infer InferredCharactersRange extends CharactersRange>
	? string & MaxCharacters<1> & AllowedCharacters<InferredCharactersRange>
	: string & MaxCharacters<1>;

export function charAt<
	GenericString extends string,
	GenericIndex extends number,
>(
	index: GenericIndex & DNumber.RequirePositiveInteger<GenericIndex>,
): (
	string: GenericString,
) => CharAtOutput<GenericString>;

export function charAt<
	GenericString extends string,
	GenericIndex extends number,
>(
	string: GenericString,
	index: GenericIndex & DNumber.RequirePositiveInteger<GenericIndex>,
): CharAtOutput<GenericString>;

export function charAt(
	...args:
		| [index: number]
		| [string: string, index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (string: string) => charAt(string, index as never);
	}

	const [string, index] = args;

	return string.charAt(index);
}
