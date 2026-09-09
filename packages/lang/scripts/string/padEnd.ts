import type * as DNumber from "@scripts/number";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type PadEndOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<GenericString, string, "minCharacters">
	: never;

export function padEnd<
	GenericString extends string,
	GenericTargetLength extends number,
>(
	targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>,
	padString: string,
): (
	string: GenericString,
) => PadEndOutput<GenericString>;

export function padEnd<
	GenericString extends string,
	GenericTargetLength extends number,
>(
	string: GenericString,
	targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>,
	padString: string,
): PadEndOutput<GenericString>;

export function padEnd(
	...args:
		| [targetLength: number, padString: string]
		| [string: string, targetLength: number, padString: string]
) {
	if (args.length === 2) {
		const [targetLength, padString] = args;

		return (string: string) => padEnd(string, targetLength as never, padString);
	}

	const [string, targetLength, padString] = args;

	return string.padEnd(targetLength, padString);
}
