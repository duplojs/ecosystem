import { createKind, HookResponse, Response } from "@core";
import * as DKind from "@duplojs/lang/kind";

describe("hook response", () => {
	it("construct", () => {
		expect(
			{ ...new HookResponse("afterSendResponse", "200", "OK", { message: "success" }) },
		).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/hook-response": null,
			"@duplojs/lang/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: { message: "success" },
			headers: undefined,
			fromHook: "afterSendResponse",
		});
	});

	it("multi instance", () => {
		class CloneHookResponse extends DKind.parentClass(
			createKind("hook-response"),
			Response,
		) {}

		expect((new CloneHookResponse({}, "100", "", undefined)) instanceof HookResponse).toBe(true);
		expect((new HookResponse("afterSendResponse", "200", "OK", null)) instanceof CloneHookResponse).toBe(true);
	});
});
