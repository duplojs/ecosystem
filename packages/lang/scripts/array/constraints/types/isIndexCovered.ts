import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMinElements, MinElements } from "../minElements";

export type IsIndexCovered<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? false
	: ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreater<InferredLength, GenericIndex>
		: ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin>
			? DNumber.IsGreater<InferredMin, GenericIndex>
			: false;
