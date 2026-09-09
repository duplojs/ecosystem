import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type ToLowerCaseOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	Lowercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
	"minCharacters"
>;

export function toLowerCase<
	GenericString extends string,
	GenericOutput = ToLowerCaseOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function toLowerCase(
	string: string,
) {
	return string.toLowerCase();
}
