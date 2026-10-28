import { createHandlerStep } from "@core/steps";

export const defaultMalformedUrlHandler = createHandlerStep({
	theFunction: (__, { response }) => response.badRequest(
		"malformed-url",
	),
	metadata: [],
});
