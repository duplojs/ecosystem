import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type CapitalizeOutput<
	GenericString extends string,
> = GenericString extends unknown
	? ReapplyCompatiblesConstraints<
		GenericString,
		Capitalize<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
		"minCharacters" | "lengthEqual"
	>
	: never;

export function capitalize<
	GenericString extends string,
>(
	string: GenericString,
): CapitalizeOutput<GenericString>;

export function capitalize(
	string: string,
) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
