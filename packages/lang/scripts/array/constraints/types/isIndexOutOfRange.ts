import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxElements, MaxElements } from "../maxElements";

export type IsIndexOutOfRange<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? false
	: ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericIndex, InferredLength>
		: ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericIndex, InferredMax>
			: false;
