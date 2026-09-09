import type { ReapplyCompatiblesConstraints, Trimmed } from "../constraints";

type TrimOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<
		GenericString,
		string & Trimmed,
		"maxCharacters"
	>
	: never;

export function trim<
	GenericString extends string,
>(
	string: GenericString,
): TrimOutput<GenericString>;

export function trim(
	string: string,
) {
	return string.trim();
}
