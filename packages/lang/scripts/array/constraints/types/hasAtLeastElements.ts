import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractMinElements, MinElements } from "../minElements";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";

export type HasAtLeastElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = DCommon.IsEqual<GenericMin, number> extends true
	? false
	: ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<InferredLength, GenericMin>
		: ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin>
			? DNumber.IsGreaterOrEqual<InferredMin, GenericMin>
			: false;
