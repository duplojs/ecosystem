import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import { type ComputeAllowedCharactersCompatibility, type AllowedCharacters, type CharactersRange } from "./constraints";

declare module "./constraints" {
	interface CharactersRangeStore {
		"a-z":
			| "a" | "b" | "c" | "d" | "e" | "f" | "g"
			| "h" | "i" | "j" | "k" | "l" | "m" | "n"
			| "o" | "p" | "q" | "r" | "s" | "t" | "u"
			| "v" | "w" | "x" | "y" | "z";
		"A-Z":
			| "A" | "B" | "C" | "D" | "E" | "F" | "G"
			| "H" | "I" | "J" | "K" | "L" | "M" | "N"
			| "O" | "P" | "Q" | "R" | "S" | "T" | "U"
			| "V" | "W" | "X" | "Y" | "Z";
		"0-9": "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
	}
}

const charactersRangeStore = new Map<CharactersRange, string>([
	["a-z", "a-z"],
	["A-Z", "A-Z"],
	["0-9", "0-9"],
]);

type ComputedCompositionPredicate<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
> = GenericValue extends unknown
	? ComputeAllowedCharactersCompatibility<
		GenericValue,
		AllowedCharacters<GenericCharactersRange>,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? GenericValue
			: never
		: GenericValue & AllowedCharacters<GenericCharactersRange>
	: never;

export function isComposedOf<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): (
	value: GenericValue,
) => value is ComputedCompositionPredicate<
	GenericValue,
	GenericCharactersRange
>;

export function isComposedOf<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	value: GenericValue,
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): value is ComputedCompositionPredicate<
	GenericValue,
	GenericCharactersRange
>;

export function isComposedOf(
	...args:
		| [charactersRange: DCommon.MaybeArray<CharactersRange>]
		| [value: string, charactersRange: DCommon.MaybeArray<CharactersRange>]
): any {
	if (args.length === 1) {
		const [charactersRange] = args;

		return (value: string) => isComposedOf(value, charactersRange);
	}

	const [value, charactersRange] = args;
	const charactersRangePattern = DArray
		.coalescing(charactersRange)
		.map((range) => charactersRangeStore.get(range)!)
		.join("");

	return new RegExp(`^[${charactersRangePattern}]*$`).test(value);
}
