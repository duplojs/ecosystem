import { createKind, Response, StreamPredictedResponse } from "@core";
import * as DKind from "@duplojs/lang/kind";

describe("stream predicted response", () => {
	it("construct", () => {
		const startStream = () => undefined;

		expect(
			{ ...new StreamPredictedResponse("200", "OK", startStream) },
		).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/stream-predicted-response": null,
			"@duplojs/lang/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startStream,
		});
	});

	it("multi instance", () => {
		class CloneStreamPredictedResponse extends DKind.parentClass(
			createKind("stream-predicted-response"),
			Response,
		) {}

		expect((
			new CloneStreamPredictedResponse({}, "100", "", undefined)
		) instanceof StreamPredictedResponse).toBe(true);
		expect((new StreamPredictedResponse("200", "OK", () => undefined)) instanceof CloneStreamPredictedResponse).toBe(true);
	});
});
