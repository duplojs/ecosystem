import { type ExtractStepOtherwiseParams } from "@core/steps";
import { type PredictedResponse } from "@core/response";
import { type Environment } from "@core/types";

export type DefaultExtractOtherwise = (
	params: ExtractStepOtherwiseParams & { readonly environment: Environment },
) => PredictedResponse;

export const defaultExtractOtherwise = (
	{
		response,
		dataStructureError,
		environment,
	}: Parameters<DefaultExtractOtherwise>[0],
) => response.unprocessableContent(
	"extract-error",
	environment === "DEV" ? dataStructureError : undefined,
);
