import { type DefaultOtherwiseExtractResponse, type ExtractStepOtherwiseParams } from "@core/types";

export const defaultExtractOtherwise = (
	{ response, dataStructureError }: ExtractStepOtherwiseParams,
): DefaultOtherwiseExtractResponse => response.unprocessableContent("extract-error", dataStructureError);
