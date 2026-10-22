import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxElements, MaxElements } from "../maxElements";

export type IsIndexOutOfRange<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DNumber.IsInteger<GenericIndex> extends true
	? ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsNegative<GenericIndex> extends true
			? DNumber.IsGreater<DNumber.Absolute<GenericIndex>, InferredLength>
			: DNumber.IsGreaterOrEqual<GenericIndex, InferredLength>
		: ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax>
			? DNumber.IsNegative<GenericIndex> extends true
				? DNumber.IsGreater<DNumber.Absolute<GenericIndex>, InferredMax>
				: DNumber.IsGreaterOrEqual<GenericIndex, InferredMax>
			: false
	: false;
