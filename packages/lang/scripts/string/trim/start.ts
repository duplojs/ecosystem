import type { ReapplyCompatiblesConstraints } from "../constraints";

type TrimStartOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<
		GenericString,
		string,
		"maxCharacters"
	>
	: never;

export function trimStart<
	GenericString extends string,
>(
	string: GenericString,
): TrimStartOutput<GenericString>;

export function trimStart(
	string: string,
) {
	return string.trimStart();
}
