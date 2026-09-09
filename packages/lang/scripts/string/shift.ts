import type { ReapplyCompatiblesConstraints } from "./constraints";

type ShiftOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">
	: never;

export function shift<
	GenericString extends string,
>(
	string: GenericString,
): ShiftOutput<GenericString>;

export function shift(
	string: string,
) {
	return string.slice(1);
}
