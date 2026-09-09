import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxCharacters, MaxCharacters } from "../maxCharacters";

export type IsIndexOutOfRange<
	GenericString extends string,
	GenericIndex extends number,
> = ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
	? DCommon.IsEqual<GenericIndex, number> extends true
		? DCommon.IsEqual<InferredMax, 0>
		: DNumber.IsNegative<GenericIndex> extends true
			? DNumber.IsGreater<DNumber.Absolute<GenericIndex>, InferredMax>
			: DNumber.IsGreaterOrEqual<GenericIndex, InferredMax>
	: ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
		? DCommon.IsEqual<GenericIndex, number> extends true
			? DCommon.IsEqual<InferredLength, 0>
			: DNumber.IsNegative<GenericIndex> extends true
				? DNumber.IsGreater<DNumber.Absolute<GenericIndex>, InferredLength>
				: DNumber.IsGreaterOrEqual<GenericIndex, InferredLength>
		: false;
