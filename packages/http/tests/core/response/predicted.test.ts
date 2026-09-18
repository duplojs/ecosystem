import { createKind, PredictedResponse, Response } from "@core";
import * as DKind from "@duplojs/lang/kind";

describe("hook response", () => {
	it("construct", () => {
		expect(
			{ ...new PredictedResponse("200", "OK", { message: "success" }) },
		).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/predicted-response": null,
			"@duplojs/lang/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: { message: "success" },
			headers: undefined,
		});
	});

	it("multi instance", () => {
		class CloneHookResponse extends DKind.parentClass(
			createKind("predicted-response"),
			Response,
		) {}

		expect((new CloneHookResponse({}, "100", "", undefined)) instanceof PredictedResponse).toBe(true);
		expect((new PredictedResponse("200", "OK", null)) instanceof CloneHookResponse).toBe(true);
	});
});
