import type { ReapplyCompatiblesConstraints } from "./constraints";

type PopOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">
	: never;

export function pop<
	GenericString extends string,
>(
	string: GenericString,
): PopOutput<GenericString>;

export function pop(
	string: string,
) {
	return string.slice(0, -1);
}
