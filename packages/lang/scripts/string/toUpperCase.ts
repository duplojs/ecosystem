import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type ToUpperCaseOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	Uppercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
	"minCharacters"
>;

export function toUpperCase<
	GenericString extends string,
	GenericOutput = ToUpperCaseOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function toUpperCase(
	string: string,
) {
	return string.toUpperCase();
}
