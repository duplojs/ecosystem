import { defaultExtractOtherwise, PredictedResponse, ResponseHelper, type Environment } from "@core";

describe("defaultExtractOtherwise", () => {
	const error = new Error("body read failed");
	it.each([
		{
			environment: "DEV",
			expectedBody: error,
		},
		{
			environment: "PROD",
			expectedBody: undefined,
		},
		{
			environment: "BUILD",
			expectedBody: undefined,
		},
	] satisfies {
		environment: Environment;
		expectedBody: Error | undefined;
	}[])(
		"returns extract-error in $environment",
		({ environment, expectedBody }) => {
			const result = defaultExtractOtherwise({
				response: ResponseHelper,
				floor: {},
				dataStructureError: error,
				environment,
			});
			expect(result).toStrictEqual(new PredictedResponse("422", "extract-error", expectedBody));
		},
	);
});
