import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMinElements, MinElements } from "../minElements";

export type IsIndexCovered<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DNumber.IsInteger<GenericIndex> extends true
	? ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsNegative<GenericIndex> extends true
			? DNumber.IsGreaterOrEqual<InferredLength, DNumber.Absolute<GenericIndex>>
			: DNumber.IsGreater<InferredLength, GenericIndex>
		: ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin>
			? DNumber.IsNegative<GenericIndex> extends true
				? DNumber.IsGreaterOrEqual<InferredMin, DNumber.Absolute<GenericIndex>>
				: DNumber.IsGreater<InferredMin, GenericIndex>
			: false
	: false;
