import type * as DKind from "@scripts/kind";
import { patternResultKind } from "./kind";
import type { PatternResult } from "./result";

export function exhaustive<
	const GenericValue extends unknown,
	GenericResult extends PatternResult<GenericValue>,
>(
	result: GenericResult,
): DKind.GetValue<typeof patternResultKind, GenericResult> {
	return patternResultKind.getValue(result);
}
