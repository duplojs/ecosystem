import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import { AllowedCharactersConstraint } from "../constraint";

export function allowedCharacters<
	GenericCharactersRange extends DString.CharactersRange,
>(
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
) {
	return AllowedCharactersConstraint(charactersRange);
}
