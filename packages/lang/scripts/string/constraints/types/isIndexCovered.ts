import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMinCharacters, MinCharacters } from "../minCharacters";

export type IsIndexCovered<
	GenericString extends string,
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? false
	: ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
		? DNumber.IsNegative<GenericIndex> extends true
			? DNumber.IsGreaterOrEqual<InferredMin, DNumber.Absolute<GenericIndex>>
			: DNumber.IsGreater<InferredMin, GenericIndex>
		: ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
			? DNumber.IsNegative<GenericIndex> extends true
				? DNumber.IsGreaterOrEqual<InferredLength, DNumber.Absolute<GenericIndex>>
				: DNumber.IsGreater<InferredLength, GenericIndex>
			: false;
