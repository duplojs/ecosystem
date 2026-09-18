import { ResponseContract } from "@core/response";
import { createHandlerStep } from "@core/steps";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const defaultNotfoundHandler = createHandlerStep({
	responseContract: ResponseContract.notFound("notfound-route", DDataStructure.string()),
	theFunction: (floor, { request, response }) => response(
		"notfound-route",
		`${request.method}:${request.path}` as never,
	),
	metadata: [],
});
