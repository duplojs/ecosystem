import { type ClientCacheStore, type Hooks, type PromiseRequestParams } from "@client";
import { PromiseRequest } from "@client/promiseRequest";
import { type AllClientResponse, type ClientResponse } from "@client/types/clientResponse";
import { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError } from "@client/unexpectedResponseError";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";

describe("PromiseRequest", () => {
	const createHooks = (): Hooks => ({
		request: [],
		response: [],
		information: {},
		code: {},
		informationalResponseType: [],
		successfulResponseType: [],
		redirectionResponseType: [],
		clientErrorResponseType: [],
		serverErrorResponseType: [],
		expectedResponse: [],
		notPredictedResponse: [],
		error: [],
		beforeRetryServerEvent: [],
		closeServerEvent: [],
		errorServerEvent: [],
		receiveEventServerEvent: [],
		startServerEvent: [],
		closeStream: [],
		errorStream: [],
		receiveDataStream: [],
		startStream: [],
	});

	const createParams = (overrides: Partial<PromiseRequestParams> = {}): PromiseRequestParams => ({
		baseUrl: "http://test.local",
		method: "GET",
		path: "/resource",
		headers: {},
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		abortController: new AbortController(),
		cacheStore: new Map(),
		...overrides,
	});

	const createResponse = (
		params: PromiseRequestParams,
		overrides: Partial<AllClientResponse> = {},
	): ClientResponse => ({
		code: "200",
		information: undefined,
		body: { ok: true },
		ok: true,
		headers: new Headers(),
		type: "basic" as ResponseType,
		url: `${params.baseUrl}${params.path}`,
		redirected: false,
		raw: {} as Response,
		requestParams: params,
		predicted: true,
		...overrides,
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("static fetch returns stream response without consuming body or caching it", async() => {
		const text = vi.fn();
		const json = vi.fn();
		const encoder = new TextEncoder();
		const cacheStore: ClientCacheStore = new Map();
		const requestParams = createParams({
			cacheStore,
			clientCache: vi.fn(() => "stream-cache-key"),
		});
		const streamResponse = {
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "text/plain; charset=utf-8",
				"x-duplojs-body-options": "stream",
				information: "stream-info",
				predicted: "true",
			}),
			body: new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(encoder.encode("hello"));
					controller.enqueue(encoder.encode(" world"));
					controller.close();
				},
			}),
			json,
			text,
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response;

		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(streamResponse));

		const result = await PromiseRequest.fetch(requestParams);

		DCommon.asserts(result, DEither.isRight);
		expect(text).not.toHaveBeenCalled();
		expect(json).not.toHaveBeenCalled();
		expect(cacheStore.size).toBe(0);
		expect(DEither.unwrapRight(result).information).toBe("stream-info");
		expect(DEither.unwrapRight(result).predicted).toBe(true);
		expect(Symbol.asyncIterator in DEither.unwrapRight(result)).toBe(true);
		await expect(DArray.from(DEither.unwrapRight(result) as AsyncIterable<unknown>)).resolves.toStrictEqual(["hello", " world"]);
	});

	it("static fetch uses global fetch and builds response or error", async() => {
		const jsonResponse = {
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ value: 1 }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response;

		const errorResponse = {
			status: 500,
			ok: false,
			statusText: "ERR",
			headers: new Headers({ "content-type": "text/plain" }),
			json: vi.fn(),
			text: vi.fn().mockResolvedValue("error"),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response;

		const seeResponse = {
			...jsonResponse,
			status: 204,
			headers: new Headers({
				"content-type": "text/event-stream",
				information: "info",
				predicted: "true",
			}),
		} as unknown as Response;

		const fetchMock = vi.fn()
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(errorResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(seeResponse)
			.mockRejectedValueOnce(new Error("network"));

		vi.stubGlobal("fetch", fetchMock);

		const paramsWithQuery = createParams({
			path: "/resource/{id}",
			params: { id: "42" },
			query: { qq: "search" },
			body: "text-body",
		});

		const paramsWithObject = createParams({
			body: { key: "value" },
		});

		const paramsWithBoolean = createParams({
			body: true,
		});

		const paramsWithNumber = createParams({
			body: 1,
		});

		const paramsWithHeader = createParams({
			headers: { "content-type": "application/json" },
			body: { key: "value" },
		});

		const paramsWithFormData = createParams({
			body: new FormData(),
		});

		const paramsWithTheFormData = createParams({
			body: DCommon.createFormData({}),
		});

		const paramsWithArray = createParams({
			body: ["test"],
		});

		const result = await PromiseRequest.fetch(paramsWithQuery);
		const resultObject = await PromiseRequest.fetch(paramsWithObject);
		const resultBoolean = await PromiseRequest.fetch(paramsWithBoolean);
		const resultNumber = await PromiseRequest.fetch(paramsWithNumber);
		const resultHeader = await PromiseRequest.fetch(paramsWithHeader);
		const resultFormData = await PromiseRequest.fetch(paramsWithFormData);
		const resultTheFormData = await PromiseRequest.fetch(paramsWithTheFormData);
		const resultArray = await PromiseRequest.fetch(paramsWithArray);
		const resultSEE = await PromiseRequest.fetch(createParams());
		const resultError = await PromiseRequest.fetch(createParams());

		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			"http://test.local/resource/42?qq=search",
			expect.objectContaining({
				method: "GET",
			}),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			7,
			"http://test.local/resource",
			expect.objectContaining({
				method: "GET",
				headers: {
					"x-duplojs-body-options": "advanced",
				},
			}),
		);

		DCommon.asserts(result, DEither.isRight);
		DCommon.asserts(resultObject, DEither.isRight);
		DCommon.asserts(resultBoolean, DEither.isRight);
		DCommon.asserts(resultNumber, DEither.isRight);
		DCommon.asserts(resultHeader, DEither.isRight);
		DCommon.asserts(resultFormData, DEither.isRight);
		DCommon.asserts(resultTheFormData, DEither.isRight);
		DCommon.asserts(resultArray, DEither.isRight);
		DCommon.asserts(resultSEE, DEither.isRight);
		DCommon.asserts(resultError, DEither.isLeft);

		expect(DEither.unwrapRight(result).body).toStrictEqual({ value: 1 });
		expect(DEither.unwrapRight(result).information).toBe("info");
		expect(DEither.unwrapRight(result).predicted).toBe(true);
		expect(DEither.unwrapRight(resultObject).ok).toBe(true);
		expect(DEither.unwrapRight(resultBoolean).ok).toBe(true);
		expect(DEither.unwrapRight(resultNumber).ok).toBeNull();
		expect(DEither.unwrapRight(resultNumber).predicted).toBe(false);
		expect(DEither.unwrapRight(resultHeader).ok).toBe(true);
		expect(Symbol.asyncIterator in DEither.unwrapRight(resultSEE)).toBe(true);
	});

	it("static fetch returns cached response without calling fetch", async() => {
		const requestParams = createParams({
			clientCache: vi.fn(() => "cache-key"),
			cacheStore: new Map([
				[
					"cache-key",
					{
						body: { cached: true },
						code: "200",
						headers: {
							"content-type": "application/json",
							"x-cache": "hit",
						},
						information: "cached",
						ok: true,
						predicted: false,
						redirected: false,
						type: "basic",
						url: "http://test.local/resource",
					},
				],
			]),
		});
		const fetchMock = vi.fn();

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		DCommon.asserts(result, DEither.isRight);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(DEither.unwrapRight(result)).toMatchObject({
			body: { cached: true },
			code: "200",
			information: "cached",
			ok: true,
			predicted: false,
			requestParams,
		});
		expect(DEither.unwrapRight(result).headers).toBeInstanceOf(Headers);
	});

	it("static fetch refreshes cache by bypassing lookup and saving fresh response", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "fresh-info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ fresh: true }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const clientCache = vi.fn(() => "cache-key");
		const cacheStore: ClientCacheStore = new Map([
			[
				"cache-key",
				{
					body: { stale: true },
					code: "200",
					headers: { "content-type": "application/json" },
					information: "stale-info",
					ok: true,
					predicted: false,
					redirected: false,
					type: "basic" as ResponseType,
					url: "http://test.local/resource",
				},
			],
		]);
		const requestParams = createParams({
			clientCache,
			cacheStore,
			refreshClientCache: true,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		DCommon.asserts(result, DEither.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(DEither.unwrapRight(result).body).toStrictEqual({ fresh: true });
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { fresh: true },
			code: "200",
			headers: {
				"content-type": "application/json",
				information: "fresh-info",
				predicted: "true",
			},
			information: "fresh-info",
			ok: true,
			predicted: true,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("static fetch saves successful responses in cache store", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ value: 1 }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const cacheStore = new Map();
		const clientCache = vi.fn(() => "cache-key");
		const requestParams = createParams({
			method: "POST",
			body: { value: 1 },
			cacheStore,
			clientCache,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		DCommon.asserts(result, DEither.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(clientCache).toHaveBeenCalledWith({
			method: requestParams.method,
			path: requestParams.path,
			body: requestParams.body,
			headers: requestParams.headers,
			hookParams: requestParams.hookParams,
			params: requestParams.params,
			query: requestParams.query,
		});
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { value: 1 },
			code: "200",
			headers: {
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			},
			information: "info",
			ok: true,
			predicted: true,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("static fetch does not read or write cache when bypassClientCache is enabled", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ live: true }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const clientCache = vi.fn(() => "cache-key");
		const cacheStore: ClientCacheStore = new Map([
			[
				"cache-key",
				{
					body: { cached: true },
					code: "200",
					headers: { "content-type": "application/json" },
					information: "cached",
					ok: true,
					predicted: false,
					redirected: false,
					type: "basic" as ResponseType,
					url: "http://test.local/resource",
				},
			],
		]);
		const requestParams = createParams({
			clientCache,
			cacheStore,
			bypassClientCache: true,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		DCommon.asserts(result, DEither.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(clientCache).not.toHaveBeenCalled();
		expect(DEither.unwrapRight(result).body).toStrictEqual({ live: true });
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { cached: true },
			code: "200",
			headers: { "content-type": "application/json" },
			information: "cached",
			ok: true,
			predicted: false,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("addRequestInterceptor", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "600" as never });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch").mockImplementation((nextParams) => {
			expect(nextParams.method).toBe("POST");
			return Promise.resolve(DEither.right("response", response));
		});

		const request = new PromiseRequest(params);
		const interceptor = vi.fn((nextParams: PromiseRequestParams) => ({
			...nextParams,
			method: "POST",
		}));

		const result = request.addRequestInterceptor(interceptor);
		await request;

		expect(result).toBe(request);
		expect(interceptor).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("addResponseInterceptor", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const interceptor = vi.fn((nextResponse: ClientResponse) => ({
			...nextResponse,
			code: "201",
		} as ClientResponse));

		const result = request.addResponseInterceptor(interceptor);
		const maybeResponse = await request;

		DCommon.asserts(maybeResponse, DEither.isRight);
		expect(result).toBe(request);
		expect(interceptor).toHaveBeenCalledWith(response);
		expect(DEither.unwrapRight(maybeResponse).code).toBe("201");
	});

	it("whenNotPredictedResponse", async() => {
		const params = createParams({ disabledPredicateMode: false });
		const response = createResponse(params, { predicted: false });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const successHook = vi.fn();
		const result = request
			.whenNotPredictedResponse(hook)
			.whenSuccessfulResponse(successHook);
		const maybeResponse = await request;

		DCommon.asserts(maybeResponse, DEither.isRight);
		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
		expect(successHook).not.toHaveBeenCalled();
	});

	it("whenInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "info-1" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenInformation(["info-1", "info-2"], hook);
		await request;

		expect(result).toBe(request);
		expect(request.hooks.information?.["info-1"]).toContain(hook);
		expect(request.hooks.information?.["info-2"]).toContain(hook);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenCode", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenCode(["201", "202"], hook);
		await request;

		expect(result).toBe(request);
		expect(request.hooks.code?.["201"]).toContain(hook);
		expect(request.hooks.code?.["202"]).toContain(hook);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenInformationalResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "102" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenInformationalResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenSuccessfulResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenSuccessfulResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenRedirectionResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "302" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenRedirectionResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenClientErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenClientErrorResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenServerErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenServerErrorResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenExpectedResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenExpectedResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenError", async() => {
		const params = createParams();
		const error = new Error("boom");
		vi.spyOn(PromiseRequest, "fetch").mockRejectedValue(error);

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenError(hook);
		const maybeResponse = await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(error, params);
		expect(DEither.isLeft(maybeResponse)).toBe(true);

		await expect(new PromiseRequest(params)).resolves.toStrictEqual(DEither.left("request-error", expect.objectContaining({})));
	});

	it("whenReceiveServerEvent", async() => {
		const spy = vi.fn();
		const params = createParams();
		const response = createResponse(params, {
			code: "200",
			headers: new Headers({ "content-type": "text/event-stream" }),
			handlerType: "events",
			onReceiveEvent: spy,
			[Symbol.asyncIterator]: async function *() {},
		});
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const result = request.whenReceiveServerEvent(
			"test",
			() => {},
		);
		await request;

		expect(result).toBe(request);
		expect(spy).toHaveBeenCalledWith("test", expect.any(Function));

		spy.mockClear();

		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", {
			...response,
			predicted: false,
		}));

		const requestNotPredicted = new PromiseRequest(params);
		const resultNotPredicated = requestNotPredicted.whenReceiveServerEvent(
			"test",
			() => {},
		);
		await requestNotPredicted;

		expect(resultNotPredicated).toBe(requestNotPredicted);
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it("whenReceiveDataStream", async() => {
		const spy = vi.fn();
		const params = createParams();
		const response = createResponse(params, {
			code: "200",
			headers: new Headers({
				"content-type": "text/plain; charset=utf-8",
				"x-duplojs-body-options": "stream",
			}),
			handlerType: "stream",
			onStream: spy,
			[Symbol.asyncIterator]: async function *() {},
		});
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const result = request.whenReceiveDataStream(
			() => {},
		);
		await request;

		expect(result).toBe(request);
		expect(spy).toHaveBeenCalledWith("receiveData", expect.any(Function));

		spy.mockClear();

		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(DEither.right("response", {
			...response,
			predicted: false,
		}));

		const requestNotPredicted = new PromiseRequest(params);
		const resultNotPredicated = requestNotPredicted.whenReceiveDataStream(
			() => {},
		);
		await requestNotPredicted;

		expect(resultNotPredicated).toBe(requestNotPredicted);
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it("iWantInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantInformation(["ready", "skip"]);

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantInformation("ready");

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantInformation("ready");

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantCode", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantCode(["200", "201"]);

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "404" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantCode("200");

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantCode("200");

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantInformationalResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "102" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantInformationalResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantInformationalResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "102",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantInformationalResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantSuccessfulResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantSuccessfulResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantSuccessfulResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantSuccessfulResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantRedirectionResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "302" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantRedirectionResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantRedirectionResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "302",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantRedirectionResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantClientErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantClientErrorResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "500" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantClientErrorResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "404",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantClientErrorResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantServerErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantServerErrorResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "400" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantServerErrorResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "500",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantServerErrorResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantExpectedResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "204" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantExpectedResponse();

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantExpectedResponse();

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "204",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantExpectedResponse();

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("selectByInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(DEither.isRight(match)).toBe(true);
		expect(DEither.unwrapRight(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: undefined });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(DEither.isLeft(miss)).toBe(true);
		expect(DEither.unwrapLeft(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(DEither.isLeft(notPredicted)).toBe(true);
		expect(DEither.unwrapLeft(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantInformationOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantInformationOrThrow("ready")).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantInformationOrThrow("ready")).rejects.toBeInstanceOf(
			UnexpectedInformationResponseError,
		);
	});

	it("iWantCodeOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantCodeOrThrow("201")).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "404" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantCodeOrThrow("201")).rejects.toBeInstanceOf(
			UnexpectedCodeResponseError,
		);
	});

	it("iWantInformationalResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "100" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantInformationalResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantInformationalResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantSuccessfulResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, {
			code: "200",
		});
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantSuccessfulResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "300" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantSuccessfulResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantRedirectionResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "301" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantRedirectionResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantRedirectionResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantClientErrorResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantClientErrorResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantClientErrorResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantServerErrorResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantServerErrorResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "400" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantServerErrorResponseOrThrow()).rejects.toMatchObject({
			expectType: "serverError",
		});
	});

	it("iWantExpectedResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "204" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantExpectedResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantExpectedResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseError,
		);
	});

	it("selectByInformationOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(DEither.right("response", response));

		const request = new PromiseRequest(params);
		await expect(
			request.iSelectExpectedResponseByInformationOrThrow({
				ready: true,
				other: false,
			}),
		).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(
			requestMiss.iSelectExpectedResponseByInformationOrThrow({
				ready: true,
				other: false,
			}),
		).rejects.toBeInstanceOf(UnexpectedResponseError);
	});

	it("toEitherByInformation creates an either selected by response information", async() => {
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		const selectedParams = createParams();
		const selectedResponse = createResponse(selectedParams, { information: "ready" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", selectedResponse));

		const selected = await new PromiseRequest(selectedParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});
		const selectedValue = DEither.unwrapSelectionOrThrow(
			selected,
			{
				ready: true,
				"unexpect-response": false,
				"request-error": false,
			},
		);

		expect(selectedValue).toBe(selectedResponse);

		const rejectedParams = createParams();
		const rejectedResponse = createResponse(rejectedParams, { information: "rejected" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", rejectedResponse));

		const rejected = await new PromiseRequest(rejectedParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(rejected, "unexpect-response"),
		).toBe(rejectedResponse);

		const withoutInformationParams = createParams();
		const withoutInformationResponse = createResponse(withoutInformationParams);
		fetchSpy.mockResolvedValueOnce(DEither.right("response", withoutInformationResponse));

		const withoutInformation = await new PromiseRequest(withoutInformationParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(withoutInformation, "unexpect-response"),
		).toBe(withoutInformationResponse);

		const notPredictedParams = createParams();
		const notPredictedResponse = createResponse(notPredictedParams, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", notPredictedResponse));

		const notPredicted = await new PromiseRequest(notPredictedParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(notPredicted, "unexpect-response"),
		).toBe(notPredictedResponse);

		const disabledPredicateParams = createParams({ disabledPredicateMode: true });
		const disabledPredicateResponse = createResponse(disabledPredicateParams, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", disabledPredicateResponse));

		const disabledPredicate = await new PromiseRequest(disabledPredicateParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(disabledPredicate, "ready"),
		).toBe(disabledPredicateResponse);

		const requestError = new Error("network");
		const requestErrorParams = createParams();
		fetchSpy.mockRejectedValueOnce(requestError);

		const failed = await new PromiseRequest(requestErrorParams).toEitherByInformation({
			ready: true,
			rejected: false,
		});
		const failure = DEither.unwrapByInformationOrThrow(failed, "request-error");

		expect(failure).toStrictEqual({
			error: requestError,
			requestParams: requestErrorParams,
		});
	});

	it("toEitherByCode creates an either selected by response code", async() => {
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		const selectedParams = createParams();
		const selectedResponse = createResponse(selectedParams, { code: "200" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", selectedResponse));

		const selected = await new PromiseRequest(selectedParams).toEitherByCode({
			200: true,
			422: false,
		});
		const selectedValue = DEither.unwrapSelectionOrThrow(
			selected,
			{
				"response-200": true,
				"unexpect-response": false,
				"request-error": false,
			},
		);

		expect(selectedValue).toBe(selectedResponse);

		const rejectedParams = createParams();
		const rejectedResponse = createResponse(rejectedParams, { code: "422" });
		fetchSpy.mockResolvedValueOnce(DEither.right("response", rejectedResponse));

		const rejected = await new PromiseRequest(rejectedParams).toEitherByCode({
			200: true,
			422: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(rejected, "unexpect-response"),
		).toBe(rejectedResponse);

		const notPredictedParams = createParams();
		const notPredictedResponse = createResponse(notPredictedParams, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", notPredictedResponse));

		const notPredicted = await new PromiseRequest(notPredictedParams).toEitherByCode({
			200: true,
			422: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(notPredicted, "unexpect-response"),
		).toBe(notPredictedResponse);

		const disabledPredicateParams = createParams({ disabledPredicateMode: true });
		const disabledPredicateResponse = createResponse(disabledPredicateParams, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(DEither.right("response", disabledPredicateResponse));

		const disabledPredicate = await new PromiseRequest(disabledPredicateParams).toEitherByCode({
			200: true,
			422: false,
		});

		expect(
			DEither.unwrapByInformationOrThrow(disabledPredicate, "response-200"),
		).toBe(disabledPredicateResponse);

		const requestError = new Error("network");
		const requestErrorParams = createParams();
		fetchSpy.mockRejectedValueOnce(requestError);

		const failed = await new PromiseRequest(requestErrorParams).toEitherByCode({
			200: true,
			422: false,
		});
		const failure = DEither.unwrapByInformationOrThrow(failed, "request-error");

		expect(failure).toStrictEqual({
			error: requestError,
			requestParams: requestErrorParams,
		});
	});

	it("Symbol.species returns Promise", () => {
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(
			DEither.right("response", createResponse(createParams())),
		);
		expect(PromiseRequest[Symbol.species]).toBe(Promise);
	});
});
