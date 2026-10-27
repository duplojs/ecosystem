import { createHandlerStep } from "@core/steps";

export const defaultNotfoundHandler = createHandlerStep({
	theFunction: (floor, { request, response }) => response.notFound(
		"notfound-route",
		`${request.method}:${request.path}`,
	),
	metadata: [],
});
