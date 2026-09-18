import { createKind, Response, StreamTextPredictedResponse } from "@core";
import * as DKind from "@duplojs/lang/kind";

describe("text stream predicted response", () => {
	it("construct", () => {
		const startStream = () => undefined;

		expect(
			{ ...new StreamTextPredictedResponse("200", "OK", startStream) },
		).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/stream-text-predicted-response": null,
			"@duplojs/lang/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startStream,
		});
	});

	it("multi instance", () => {
		class CloneStreamTextPredictedResponse extends DKind.parentClass(
			createKind("stream-text-predicted-response"),
			Response,
		) {}

		expect((
			new CloneStreamTextPredictedResponse({}, "100", "", undefined)
		) instanceof StreamTextPredictedResponse).toBe(true);
		expect((new StreamTextPredictedResponse("200", "OK", () => undefined)) instanceof CloneStreamTextPredictedResponse).toBe(true);
	});
});
