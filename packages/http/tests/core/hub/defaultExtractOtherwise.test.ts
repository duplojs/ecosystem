import { defaultExtractOtherwise, PredictedResponse, ResponseHelper } from "@core";
import type * as DCommon from "@duplojs/lang/common";

describe("defaultExtractOtherwise", () => {
	it("returns the extraction error", () => {
		const error = new Error("body read failed");
		const result = defaultExtractOtherwise({
			response: ResponseHelper,
			floor: {},
			dataStructureError: error,
		});

		type _Parameters = DCommon.ExpectType<
			keyof Parameters<typeof defaultExtractOtherwise>[0],
			"response" | "floor" | "dataStructureError",
			"strict"
		>;
		expect(result).toStrictEqual(new PredictedResponse("422", "extract-error", error));
	});
});
