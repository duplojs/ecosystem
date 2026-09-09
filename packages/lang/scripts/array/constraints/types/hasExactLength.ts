import type * as DCommon from "@scripts/common";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";

export type HasExactLength<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<InferredLength, GenericLength>
	: false;
