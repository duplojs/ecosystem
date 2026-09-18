import { type RequestInitializationData, Request } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import { createBodyReader } from "@test-utils/bodyReader";

type InitializationData = DCommon.SimplifyTopLevel<
	& Omit<Partial<RequestInitializationData>, "raw">
	& { body?: unknown }
	& { raw?: unknown }
>;

export function createFakeRequest({ raw, ...initializationData }: InitializationData = {}) {
	return new Request({
		method: "GET",
		path: "/",
		headers: {},
		query: {},
		params: {},
		host: "",
		matchedPath: "/",
		origin: "",
		url: "",
		raw: {} as any,
		bodyReader: createBodyReader(),
		...initializationData,
	});
}
