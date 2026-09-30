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
>(
	string: GenericString,
): UncapitalizeOutput<GenericString>;

export function uncapitalize(
	string: string,
) {
	return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
}
