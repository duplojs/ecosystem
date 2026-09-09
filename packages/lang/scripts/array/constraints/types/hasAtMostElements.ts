import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { ExtractMaxElements, MaxElements } from "../maxElements";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";

export type HasAtMostElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = DCommon.IsEqual<GenericMax, number> extends true
	? false
	: ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericMax, InferredLength>
		: ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericMax, InferredMax>
			: false;
