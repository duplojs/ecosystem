import { Request } from "@core";
import { createBodyReader } from "./bodyReader";

export function createTestRequest(params: Partial<ConstructorParameters<typeof Request>[0]> = {}) {
	return new Request({
		headers: {},
		host: "localhost",
		matchedPath: "/test",
		method: "GET",
		origin: "http://localhost",
		path: "/test",
		params: {},
		query: {},
		url: "http://localhost/test",
		bodyReader: createBodyReader(),
		...params,
	});
}
