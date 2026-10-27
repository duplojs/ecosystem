import { type PredictedResponse } from "@core/response";
import type * as DCommon from "@duplojs/lang/common";

export interface OverrideDefaultOtherwiseExtractResponse {

}

export type DefaultOtherwiseExtractResponse = OverrideDefaultOtherwiseExtractResponse extends infer InferredValue
	? "override" extends keyof InferredValue
		? DCommon.NeverCoalescing<
			Extract<InferredValue["override"], PredictedResponse>,
			PredictedResponse<"422", "extract-error", Error>
		>
		: PredictedResponse<"422", "extract-error", Error>
	: never;
