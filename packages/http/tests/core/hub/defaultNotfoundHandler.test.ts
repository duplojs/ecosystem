import { defaultNotfoundHandler, ResponseHelper, PredictedResponse } from "@core";
import { createTestRequest } from "@test-utils/createTestRequest";

describe("defaultNotfoundHandler", () => {
	it("builds the system response using the response helpers", () => {
		const result = defaultNotfoundHandler.definition.theFunction({}, {
			response: ResponseHelper,
			request: createTestRequest({ path: "/path/to/a" }),
		});
		expect(result).toStrictEqual(new PredictedResponse("404", "notfound-route", "GET:/path/to/a"));
	});
});
