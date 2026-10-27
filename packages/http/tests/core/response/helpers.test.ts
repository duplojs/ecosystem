import { ResponseHelper, PredictedResponse, ServerSentEventsPredictedResponse, StreamPredictedResponse, StreamTextPredictedResponse } from "@core";
import type * as DCommon from "@duplojs/lang/common";

describe("ResponseHelper", () => {
	it("preserves literal information and a readonly body", () => {
		const result = ResponseHelper.ok("found", {
			id: 42,
			labels: ["user"],
		});
		type _Response = DCommon.ExpectType<
			typeof result,
			PredictedResponse<"200", "found", {
				readonly id: 42;
				readonly labels: readonly ["user"];
			}>,
			"strict"
		>;
		expect(result).toStrictEqual(new PredictedResponse("200", "found", {
			id: 42,
			labels: ["user"],
		}));
	});

	it.each([
		{
			method: "http100Continue",
			code: "100",
		},
		{
			method: "switchingProtocols",
			code: "101",
		},
		{
			method: "processing",
			code: "102",
		},
		{
			method: "earlyHints",
			code: "103",
		},
		{
			method: "created",
			code: "201",
		},
		{
			method: "accepted",
			code: "202",
		},
		{
			method: "nonAuthoritativeInformation",
			code: "203",
		},
		{
			method: "resetContent",
			code: "205",
		},
		{
			method: "partialContent",
			code: "206",
		},
		{
			method: "multiStatus",
			code: "207",
		},
		{
			method: "alreadyReported",
			code: "208",
		},
		{
			method: "imUsed",
			code: "226",
		},
		{
			method: "badRequest",
			code: "400",
		},
		{
			method: "unauthorized",
			code: "401",
		},
		{
			method: "paymentRequired",
			code: "402",
		},
		{
			method: "forbidden",
			code: "403",
		},
		{
			method: "notFound",
			code: "404",
		},
		{
			method: "methodNotAllowed",
			code: "405",
		},
		{
			method: "notAcceptable",
			code: "406",
		},
		{
			method: "proxyAuthenticationRequired",
			code: "407",
		},
		{
			method: "requestTimeout",
			code: "408",
		},
		{
			method: "conflict",
			code: "409",
		},
		{
			method: "gone",
			code: "410",
		},
		{
			method: "lengthRequired",
			code: "411",
		},
		{
			method: "preconditionFailed",
			code: "412",
		},
		{
			method: "contentTooLarge",
			code: "413",
		},
		{
			method: "uriTooLong",
			code: "414",
		},
		{
			method: "unsupportedMediaType",
			code: "415",
		},
		{
			method: "rangeNotSatisfiable",
			code: "416",
		},
		{
			method: "expectationFailed",
			code: "417",
		},
		{
			method: "imATeapot",
			code: "418",
		},
		{
			method: "misdirectedRequest",
			code: "421",
		},
		{
			method: "unprocessableContent",
			code: "422",
		},
		{
			method: "locked",
			code: "423",
		},
		{
			method: "failedDependency",
			code: "424",
		},
		{
			method: "tooEarly",
			code: "425",
		},
		{
			method: "upgradeRequired",
			code: "426",
		},
		{
			method: "preconditionRequired",
			code: "428",
		},
		{
			method: "tooManyRequests",
			code: "429",
		},
		{
			method: "requestHeaderFieldsTooLarge",
			code: "431",
		},
		{
			method: "unavailableForLegalReasons",
			code: "451",
		},
		{
			method: "internalServerError",
			code: "500",
		},
		{
			method: "notImplemented",
			code: "501",
		},
		{
			method: "badGateway",
			code: "502",
		},
		{
			method: "serviceUnavailable",
			code: "503",
		},
		{
			method: "gatewayTimeout",
			code: "504",
		},
		{
			method: "httpVersionNotSupported",
			code: "505",
		},
		{
			method: "variantAlsoNegotiates",
			code: "506",
		},
		{
			method: "insufficientStorage",
			code: "507",
		},
		{
			method: "loopDetected",
			code: "508",
		},
		{
			method: "notExtended",
			code: "510",
		},
		{
			method: "networkAuthenticationRequired",
			code: "511",
		},
	] as const)("$method uses status $code with an optional body", ({ method, code }) => {
		const helper: (information: string, body?: unknown) => PredictedResponse = ResponseHelper[method];
		expect(helper("information")).toStrictEqual(new PredictedResponse(code, "information", undefined));
		expect(helper("information", { id: 42 })).toStrictEqual(new PredictedResponse(code, "information", { id: 42 }));
	});

	it.each([
		{
			method: "noContent",
			code: "204",
		},
		{
			method: "multipleChoices",
			code: "300",
		},
		{
			method: "movedPermanently",
			code: "301",
		},
		{
			method: "found",
			code: "302",
		},
		{
			method: "seeOther",
			code: "303",
		},
		{
			method: "notModified",
			code: "304",
		},
		{
			method: "useProxy",
			code: "305",
		},
		{
			method: "switchProxy",
			code: "306",
		},
		{
			method: "temporaryRedirect",
			code: "307",
		},
		{
			method: "permanentRedirect",
			code: "308",
		},
	] as const)("$method uses bodyless status $code", ({ method, code }) => {
		expect(ResponseHelper[method]("redirect")).toStrictEqual(new PredictedResponse(code, "redirect", undefined));
	});

	it("builds SSE and stream responses around the supplied callbacks", () => {
		const onStart = vi.fn();
		const events = ResponseHelper.serverSentEvents("events").onStart<string, { ping: number }>(onStart);
		const binary = ResponseHelper.stream("binary").onStart<{ id: number }>(onStart);
		const text = ResponseHelper.streamText("text").onStart(onStart);
		expect(events).toStrictEqual(new ServerSentEventsPredictedResponse("200", "events", onStart));
		expect(binary).toStrictEqual(new StreamPredictedResponse("200", "binary", onStart));
		expect(text).toStrictEqual(new StreamTextPredictedResponse("200", "text", onStart));
		expect(onStart).not.toHaveBeenCalled();
	});

	it("defaults SSE message payloads to never without an explicit type", () => {
		const result = ResponseHelper.serverSentEvents("events").onStart(async({ send }) => {
			// @ts-expect-error message payloads require an explicit type
			await send("message", { id: 42 });
			// @ts-expect-error primitive payloads also require an explicit type
			await send("message", "hello");
			// @ts-expect-error undeclared events cannot be sent
			await send("ping", 42);
		});

		type _Response = DCommon.ExpectType<
			typeof result,
			ServerSentEventsPredictedResponse<"200", "events", { message: never }>,
			"strict"
		>;
		expect(result).toBeInstanceOf(ServerSentEventsPredictedResponse);
	});

	it("enforces explicitly declared SSE message and event payloads", () => {
		const result = ResponseHelper.serverSentEvents("events").onStart<{ id: number }, { ping: number }>(async({ send }) => {
			await send("message", { id: 42 });
			await send("ping", 42);
			// @ts-expect-error message payloads must match the declared type
			await send("message", { id: "42" });
			// @ts-expect-error a non-optional message payload cannot be omitted
			await send("message");
			// @ts-expect-error custom event payloads must match their declared type
			await send("ping", "42");
			// @ts-expect-error undeclared events cannot be sent
			await send("other", 42);
		});

		type _Response = DCommon.ExpectType<
			typeof result,
			ServerSentEventsPredictedResponse<"200", "events", { message: { id: number } } & { ping: number }>,
			"strict"
		>;
		expect(result).toBeInstanceOf(ServerSentEventsPredictedResponse);
	});
});
