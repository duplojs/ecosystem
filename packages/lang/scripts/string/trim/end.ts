import type { ReapplyCompatiblesConstraints } from "../constraints";

type TrimEndOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<
		GenericString,
		string,
		"maxCharacters"
	>
	: never;

export function trimEnd<
	GenericString extends string,
>(
	string: GenericString,
): TrimEndOutput<GenericString>;

export function trimEnd(
	string: string,
) {
	return string.trimEnd();
}
