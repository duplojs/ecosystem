import { createKind, Response, ServerSentEventsPredictedResponse } from "@core";
import * as DKind from "@duplojs/lang/kind";

describe("server sent events predicted response", () => {
	it("construct", () => {
		const startSendingEvents = () => undefined;

		expect(
			{ ...new ServerSentEventsPredictedResponse("200", "OK", startSendingEvents) },
		).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/server-sent-events-predicted-response": null,
			"@duplojs/lang/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startSendingEvents,
		});
	});

	it("multi instance", () => {
		class CloneServerSentEventsPredictedResponse extends DKind.parentClass(
			createKind("server-sent-events-predicted-response"),
			Response,
		) {}

		expect((
			new CloneServerSentEventsPredictedResponse({}, "100", "", undefined)
		) instanceof ServerSentEventsPredictedResponse).toBe(true);
		expect((new ServerSentEventsPredictedResponse("200", "OK", () => undefined)) instanceof CloneServerSentEventsPredictedResponse).toBe(true);
	});
});
