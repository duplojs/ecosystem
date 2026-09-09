import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type UncapitalizeOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	Uncapitalize<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
	"minCharacters"
>;

export function uncapitalize<
	GenericString extends string,
	GenericOutput = UncapitalizeOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function uncapitalize(
	string: string,
) {
	return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
}
