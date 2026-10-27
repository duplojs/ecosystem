import { defaultMalformedUrlHandler, ResponseHelper, PredictedResponse } from "@core";
import { createTestRequest } from "@test-utils/createTestRequest";

describe("defaultMalformedUrlHandler", () => {
	it("builds the system response using the response helpers", () => {
		const result = defaultMalformedUrlHandler.definition.theFunction({}, {
			response: ResponseHelper,
			request: createTestRequest({ path: "/path/to/a" }),
		});
		expect(result).toStrictEqual(new PredictedResponse("400", "malformed-url", undefined));
	});
});
