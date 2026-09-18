import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { type AllNotPredictedClientResponse, type ClientEventsResponseHandler, createHttpClient, type FindServerRoute, type PromiseRequestParams, type RequestErrorContent, type ServerRouteToClientRequestParams } from "@duplojs/http/client";
import { type Routes } from "./clientType";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import { createFileToSend } from "@utils";
import * as DSFile from "@duplojs/server/file";
import * as DPath from "@duplojs/lang/path";

describe("client", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8946,
		uploadFolder: DPath.resolveRelative([DPath.createOrThrow(import.meta.dirname), DCommon.cast("../files/upload")]),
	});

	process.chdir(DPath.resolveRelative([DPath.createOrThrow(import.meta.dirname), DCommon.cast("..")]));

	afterAll(() => {
		server.close();
	});

	const httpClient = createHttpClient<Routes>({
		baseUrl: "http://localhost:8946",
	});

	it("get all users", async() => {
		type RequestParams = DCommon.SimplifyTopLevel<
			& ServerRouteToClientRequestParams<
				FindServerRoute<
					Routes,
					"GET",
					"/users"
				>
			>
			& PromiseRequestParams
		>;

		const result = await httpClient.get("/users", { clientCache: "auto" });

		type Check = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| {
					code: "200";
					information: "users.findMany";
					body: {
						id: number;
						name: string;
						age: number;
					}[];
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users",
					information: "users.findMany",
					body: [
						{
							age: 28,
							id: 23,
							name: "",
						},
					],
					predicted: true,
				}),
			),
		);

		const resultFromCache = await httpClient.get("/users", { clientCache: "auto" });

		expect(resultFromCache).toStrictEqual(
			DEither.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users",
					information: "users.findMany",
					body: [
						{
							age: 28,
							id: 23,
							name: "",
						},
					],
					predicted: true,
					fromCache: true,
				}),
			),
		);
	});

	it("get user", async() => {
		const result = await httpClient.get("/users/{userId}", { params: { userId: DString.to(15) } });

		type RequestParams = DCommon.SimplifyTopLevel<
			& ServerRouteToClientRequestParams<
				FindServerRoute<
					Routes,
					"GET",
					"/users/{userId}"
				>
			>
			& PromiseRequestParams
		>;

		type Check = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
				| {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users/15",
					information: "users.find",
					body: {
						age: 28,
						id: 15,
						name: "",
					},
					predicted: true,
				}),
			),
		);
	});

	it("post user", async() => {
		const result = await httpClient.post("/users", {
			body: {
				id: 5,
				name: "math",
				age: 23,
			},
		});

		type RequestParams = DCommon.SimplifyTopLevel<
			& ServerRouteToClientRequestParams<
				FindServerRoute<
					Routes,
					"POST",
					"/users"
				>
			>
			& PromiseRequestParams
		>;

		type Check = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| {
					code: "200";
					information: "users.create";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users",
					information: "users.create",
					body: {
						id: 5,
						name: "math",
						age: 23,
					},
					predicted: true,
				}),
			),
		);
	});

	it("post document", async() => {
		const result = await httpClient.post("/documents", {
			body: DCommon.createFormData({
				bool: true,
				myFile: [await createFileToSend(DCommon.cast("files/fakeFiles/1mb.jpg"), "//😄.jpg")],
				name: "client/testClient.generate",
			}),
		});

		type RequestParams = DCommon.SimplifyTopLevel<
			& ServerRouteToClientRequestParams<
				FindServerRoute<
					Routes,
					"POST",
					"/documents"
				>
			>
			& PromiseRequestParams
		>;

		type Check = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| {
					code: "204";
					information: "file.receive";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/documents",
					information: "file.receive",
					predicted: true,
				}),
			),
		);

		await DCommon.timeout(500);

		expect(await DSFile.stat(DCommon.cast("files/store/client/testClient.generate.jpg") satisfies string & DPath.Path)).toStrictEqual(
			DEither.success(
				expect.objectContaining({ sizeBytes: DCommon.stringToBytes("1mb") }),
			),
		);
		DCommon.asserts(
			await DSFile.remove(
				DCommon.cast("files/store/client/testClient.generate.jpg") satisfies string & DPath.Path,
			),
			DEither.isRight,
		);
		expect(await DSFile.readDirectory(DCommon.cast("files/upload") satisfies string & DPath.Path)).toStrictEqual(
			DEither.success([".gitkeep"]),
		);
	});

	describe("server sent events", () => {
		it("stream and retry 2 time", async() => {
			const spyClientMessage = vi.fn();
			const spyClientOther = vi.fn();
			const spyMessage = vi.fn();
			const spyOther = vi.fn();
			const spyAllEvent = vi.fn();

			const result = await httpClient
				.get("/sse")
				.whenReceiveServerEvent("message", spyClientMessage)
				.whenReceiveServerEvent("other", spyClientOther)
				.iWantInformationOrThrow("super-sse");

			type RequestParams = DCommon.SimplifyTopLevel<
				& ServerRouteToClientRequestParams<
					FindServerRoute<
						Routes,
						"GET",
						"/sse"
					>
				>
				& PromiseRequestParams
			>;

			type Check = DCommon.ExpectType<
				typeof result,
				(
					{
						code: "200";
						information: "super-sse";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean;
					}
					& ClientEventsResponseHandler<
						| {
							event: "other";
							data: string;
							id?: string | undefined;
							retry?: number | undefined;
						}
						| {
							event: "message";
							data: { test: string };
							id?: string | undefined;
							retry?: number | undefined;
						}
					>
				),
				"strict"
			>;

			void result
				.onStreamEvent("receiveServerEvents", spyAllEvent)
				.onReceiveEvent("message", spyMessage)
				.onReceiveEvent("other", spyOther)
				.consumeEventStream();

			await DCommon.timeout(1000);
			result.closeEventStream();

			const event1 = {
				event: "message",
				id: undefined,
				retry: 100,
				data: { test: "1" },
			};

			const event2 = {
				event: "message",
				id: "test",
				retry: undefined,
				data: { test: "2" },
			};

			const event3 = {
				event: "other",
				id: undefined,
				retry: undefined,
				data: "3",
			};

			expect(spyAllEvent).toHaveBeenCalledTimes(6);
			expect(spyAllEvent).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(3, event3, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(4, event1, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(5, event2, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(6, event3, expect.any(Object));

			expect(spyClientMessage).toHaveBeenCalledTimes(4);
			expect(spyClientMessage).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(3, event1, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(4, event2, expect.any(Object));

			expect(spyMessage).toHaveBeenCalledTimes(4);
			expect(spyMessage).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(3, event1, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(4, event2, expect.any(Object));

			expect(spyClientOther).toHaveBeenCalledTimes(2);
			expect(spyClientOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));

			expect(spyOther).toHaveBeenCalledTimes(2);
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
		});

		it("cancel reconnection", async() => {
			const result = await httpClient
				.get("/sse")
				.iWantInformationOrThrow("super-sse");

			result.onStreamEvent(
				"beforeRetry",
				(response) => void response.closeEventStream(),
			);

			await expect(DArray.from(result)).resolves.toStrictEqual([
				{
					data: {
						test: "1",
					},
					event: "message",
					id: undefined,
					retry: 100,
				},
				{
					data: {
						test: "2",
					},
					event: "message",
					id: "test",
					retry: undefined,
				},
				{
					data: "3",
					event: "other",
					id: undefined,
					retry: undefined,
				},
			]);
		});
	});

	describe("stream", () => {
		it("Uint8Array", async() => {
			const spyClientFlux = vi.fn();
			const spyFlux = vi.fn();
			const encoder = new TextEncoder();

			const result = await httpClient
				.get(
					"/stream",
					{ query: { value: "15" } },
				)
				.whenReceiveDataStream(spyClientFlux)
				.iWantInformationOrThrow("monSuperStream");

			result.onStream("receiveData", spyFlux);

			await result.consumeStream();

			expect(spyClientFlux).toHaveBeenCalledTimes(6);
			expect(spyClientFlux).toHaveBeenNthCalledWith(1, encoder.encode("1"), expect.any(Object));
			expect(spyClientFlux).toHaveBeenNthCalledWith(2, encoder.encode("2"), expect.any(Object));
			expect(spyClientFlux).toHaveBeenNthCalledWith(3, encoder.encode("3"), expect.any(Object));
			expect(spyClientFlux).toHaveBeenNthCalledWith(4, encoder.encode("4"), expect.any(Object));
			expect(spyClientFlux).toHaveBeenNthCalledWith(5, encoder.encode("5"), expect.any(Object));
			expect(spyClientFlux).toHaveBeenNthCalledWith(6, encoder.encode("15"), expect.any(Object));

			expect(spyFlux).toHaveBeenCalledTimes(6);
			expect(spyFlux).toHaveBeenNthCalledWith(1, encoder.encode("1"), expect.any(Object));
			expect(spyFlux).toHaveBeenNthCalledWith(2, encoder.encode("2"), expect.any(Object));
			expect(spyFlux).toHaveBeenNthCalledWith(3, encoder.encode("3"), expect.any(Object));
			expect(spyFlux).toHaveBeenNthCalledWith(4, encoder.encode("4"), expect.any(Object));
			expect(spyFlux).toHaveBeenNthCalledWith(5, encoder.encode("5"), expect.any(Object));
			expect(spyFlux).toHaveBeenNthCalledWith(6, encoder.encode("15"), expect.any(Object));
		});

		it("text", async() => {
			const result = await httpClient
				.post(
					"/stream-text",
					{ body: { value: "Trop fort" } },
				)
				.iWantInformationOrThrow("monSuperStream");

			await expect(DArray.from(result)).resolves.toStrictEqual([
				"super",
				"Value",
				"De",
				"La",
				"Mort",
				" Trop fort",
			]);
		});
	});
});
