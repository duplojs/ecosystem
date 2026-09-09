import type * as DNumber from "@scripts/number";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type PadStartOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<GenericString, string, "minCharacters">
	: never;

export function padStart<
	GenericString extends string,
	GenericTargetLength extends number,
>(
	targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>,
	padString: string,
): (
	string: GenericString,
) => PadStartOutput<GenericString>;

export function padStart<
	GenericString extends string,
	GenericTargetLength extends number,
>(
	string: GenericString,
	targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>,
	padString: string,
): PadStartOutput<GenericString>;

export function padStart(
	...args:
		| [targetLength: number, padString: string]
		| [string: string, targetLength: number, padString: string]
) {
	if (args.length === 2) {
		const [targetLength, padString] = args;

		return (string: string) => padStart(string, targetLength as never, padString);
	}

	const [string, targetLength, padString] = args;

	return string.padStart(targetLength, padString);
}
