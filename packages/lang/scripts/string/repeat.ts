import type * as DNumber from "@scripts/number";
import type { ReapplyAllowedCharacters } from "./constraints";

type RepeatOutput<
	GenericString extends string,
> = ReapplyAllowedCharacters<GenericString, string>;

export function repeat<
	GenericString extends string,
	GenericCount extends number,
>(
	count: GenericCount & DNumber.RequirePositiveInteger<GenericCount>,
): (
	string: GenericString,
) => RepeatOutput<GenericString>;

export function repeat<
	GenericString extends string,
	GenericCount extends number,
>(
	string: GenericString,
	count: GenericCount & DNumber.RequirePositiveInteger<GenericCount>,
): RepeatOutput<GenericString>;

export function repeat(
	...args:
		| [count: number]
		| [string: string, count: number]
) {
	if (args.length === 1) {
		const [count] = args;
		return (string: string) => repeat(string, count as never);
	}

	const [string, count] = args;

	if (count < 0 || !Number.isFinite(count)) {
		return "";
	}

	return string.repeat(count);
}
