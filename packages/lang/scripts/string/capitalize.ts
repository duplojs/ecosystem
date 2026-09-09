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
	GenericOutput = CapitalizeOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function capitalize(
	string: string,
) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
