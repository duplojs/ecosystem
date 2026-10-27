import { createTestRequest } from "@test-utils/createTestRequest";
import { useTestStepFunctionBuilder } from "@test-utils/useTestStepFunctionBuilder";
import { createExtractStep, type DefaultExtractOtherwise, useRouteBuilder, Request, PredictedResponse } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DSFile from "@duplojs/server/file";
import { createBodyReader } from "@test-utils/bodyReader";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("extract step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
		TESTImplementation.clear();
	});

	it("sub extract value from params", async() => {
		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.handler(
				(floor, { response }) => response.ok("good", floor.value),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: { value: "test" },
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test"),
			}),
		);
	});

	it("extract value from origin", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DDataStructure.string() })
			.handler(
				(floor, { response }) => response.ok("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test1"),
			}),
		);
	});

	it("error extract dev", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DDataStructure.number() })
			.handler(
				(floor, { response }) => response.ok("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					expect.any(DDataStructure.Error),
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("error sub extract", async() => {
		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.handler(
				(floor, { response }) => response.ok("good", floor.value),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					expect.any(DDataStructure.Error),
				)
					.setHeader("extract-key", "request.params.value"),
			}),
		);
	});

	it("error extract prod", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DDataStructure.number() })
			.handler(
				(floor, { response }) => response.ok("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					undefined,
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("custom error extract", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DDataStructure.number() }, ({ response }) => response.badRequest("test-custom"))
			.handler(
				(floor, { response }) => response.ok("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"400",
					"test-custom",
					undefined,
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("extract body", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DDataStructure.number() })
			.handler(
				(floor, { response }) => response.ok("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => 12),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"good",
					12,
				),
			}),
		);
	});

	it("fail extract body", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DDataStructure.number() })
			.handler(
				(floor, { response }) => response.ok("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "DEV" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => new Error("fail")),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					new Error("fail"),
				)
					.setHeader("extract-key", "request.body"),
			}),
		);
	});

	it("extract with async structure", async() => {
		setEnvironment("TEST");
		TESTImplementation.set("stat", () => Promise.resolve({ isFile: true } as never));

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ path: DSDataStructure.file([DSDataStructure.fileExist()]) })
			.handler(
				(floor, { response }) => response.ok("good", floor.path),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, {
			environment: "DEV",
			defaultCodecs: { path: DSDataStructure.codecsString },
		});

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "test/file",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => undefined),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"good",
					expect.objectContaining({
						path: "test/file",
					}),
				),
			}),
		);
	});

	it("extract body with async structure", async() => {
		setEnvironment("TEST");
		TESTImplementation.set("stat", () => Promise.resolve({ isFile: true } as never));

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DSDataStructure.file([DSDataStructure.fileExist()]) })
			.handler(
				(floor, { response }) => response.ok("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "DEV" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => DSFile.createFileInterface(DPath.declarePath("test/file"))),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"good",
					expect.objectContaining({
						path: "test/file",
					}),
				),
			}),
		);
	});

	it("passes a body reading error to the global otherwise and preserves its response", async() => {
		const error = new Error("cannot read body");
		const floor = { context: "kept" };
		const otherwise = vi.fn<DefaultExtractOtherwise>(
			({ response, dataStructureError }) => response.badRequest("read-failed", dataStructureError.message),
		);
		const step = createExtractStep({
			shape: { body: DDataStructure.string() },
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step, {
			defaultExtractOtherwise: otherwise,
			environment: "PROD",
		});
		const request = createTestRequest({ bodyReader: createBodyReader(() => error) });
		const result = await built.buildedFunction(request, floor);
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			floor,
			dataStructureError: error,
			environment: "PROD",
		}));
		expect(result).toBe(otherwise.mock.results[0]?.value);
		expect(result).toStrictEqual(
			new PredictedResponse("400", "read-failed", "cannot read body")
				.setHeader("extract-key", "request.body"),
		);
	});

	it("prefers a local otherwise over the global callback and stops further extraction", async() => {
		const globalOtherwise = vi.fn<DefaultExtractOtherwise>(({ response }) => response.notFound("global"));
		const localOtherwise = vi.fn<DefaultExtractOtherwise>(
			({ response, floor }) => response.forbidden("local", floor.context),
		);
		const reader = vi.fn(() => "should not be read");
		const step = createExtractStep({
			shape: {
				params: { id: DDataStructure.number() },
				body: DDataStructure.string(),
			},
			otherwise: localOtherwise,
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step, { defaultExtractOtherwise: globalOtherwise });
		const request = createTestRequest({
			params: { id: "invalid" },
			bodyReader: createBodyReader(reader),
		});
		const result = await built.buildedFunction(request, { context: "kept" });
		expect(globalOtherwise).not.toHaveBeenCalled();
		expect(reader).not.toHaveBeenCalled();
		expect(localOtherwise).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			dataStructureError: expect.any(DDataStructure.Error),
		}));
		expect(result).toStrictEqual(
			new PredictedResponse("403", "local", "kept").setHeader("extract-key", "request.params.id"),
		);
	});

	it("passes the progressively populated floor to otherwise", async() => {
		const otherwise = vi.fn<DefaultExtractOtherwise>(({ response }) => response.badRequest("invalid"));
		const step = createExtractStep({
			shape: {
				params: {
					first: DDataStructure.string(),
					second: DDataStructure.number(),
				},
			},
			otherwise,
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step);
		const request = createTestRequest({
			params: {
				first: "accepted",
				second: "invalid",
			},
		});
		await built.buildedFunction(request, { kept: true });
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			floor: {
				kept: true,
				first: "accepted",
			},
		}));
	});
});
