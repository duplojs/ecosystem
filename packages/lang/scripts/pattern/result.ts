import type * as DKind from "@scripts/kind";
import { patternResultKind } from "./kind";

export interface PatternResult<
	GenericValue extends unknown = any,
> extends DKind.Kind<typeof patternResultKind, GenericValue> {

}

export function result<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): PatternResult<GenericValue> {
	return patternResultKind.addTo({}, value);
}

export const isResult = patternResultKind.has;
