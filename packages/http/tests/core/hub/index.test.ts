import { createTestRequest } from "@test-utils/createTestRequest";
import { ResponseHelper, PredictedResponse, type ExtractOtherwise, type HookRouteLifeCycle, defaultBodyController, createHub, defaultCheckerStepFunctionBuilder, defaultExtractOtherwise, defaultNotfoundHandler, defaultRouteFunctionBuilder, hubKind, Request, type HookHubLifeCycle, TextBodyController, controlBodyAsText, defaultMalformedUrlHandler, defaultEmptyReaderImplementation, defaultExtractShapeCodecs } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { testRoute } from "@test-utils/route";

describe("hub", () => {
	const baseHub = {
		[hubKind.runTimeKey]: null,
		classRequest: Request,
		config: { environment: "DEV" },
		defaultExtractOtherwise,
		hooksHubLifeCycle: [],
		hooksRouteLifeCycle: [],
		notfoundHandler: defaultNotfoundHandler,
		defaultBodyController: defaultBodyController,
		malformedUrlHandler: defaultMalformedUrlHandler,
		plugins: [],
		routeFunctionBuilders: [],
		routes: new Set(),
		stepFunctionBuilders: [],
		bodyReaderImplementations: [defaultEmptyReaderImplementation],
		routerFunctionBuilder: undefined,
		defaultExtractShapeCodecs: defaultExtractShapeCodecs,
	};

	it("hub shape", () => {
		const hub = createHub({
			environment: "DEV",
		});

		expect({ ...hub }).toStrictEqual(baseHub);
	});

	it("hub register", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.register(testRoute);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute]),
		});

		const otherRoute = { ...testRoute };
		hub.register([otherRoute]);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute, otherRoute]),
		});

		const otherOtherRoute = { ...testRoute };
		hub.register({ otherOtherRoute });

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute, otherRoute, otherOtherRoute]),
		});
	});

	it("hub plug", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.plug({ name: "test" });

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			plugins: [{ name: "test" }],
		});

		hub.plug((hub) => ({
			name: "test",
			hub,
		}));

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			plugins: [
				{ name: "test" },
				{
					name: "test",
					hub,
				},
			],
		});

		const bodyReaderImplementation = TextBodyController.createReaderImplementation(() => void 0 as never);

		hub.plug({
			name: "1",
			bodyReaderImplementations: [bodyReaderImplementation],
		});

		expect(hub.bodyReaderImplementations).toStrictEqual([
			defaultEmptyReaderImplementation,
			bodyReaderImplementation,
		]);

		hub.plug({
			name: "1",
			hooksHubLifeCycle: [{}],
		});

		expect(hub.hooksHubLifeCycle).toStrictEqual([{}]);

		hub.plug({
			name: "1",
			hooksRouteLifeCycle: [{}],
		});

		expect(hub.hooksRouteLifeCycle).toStrictEqual([{}]);

		hub.plug({
			name: "1",
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
		});

		expect(hub.routeFunctionBuilders).toStrictEqual([defaultRouteFunctionBuilder]);

		hub.plug({
			name: "1",
			routes: [testRoute],
		});

		expect(hub.routes).toStrictEqual(new Set([testRoute]));

		hub.plug({
			name: "1",
			stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
		});

		expect(hub.stepFunctionBuilders).toStrictEqual([defaultCheckerStepFunctionBuilder]);
	});

	it("hub add route function builder", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.addRouteFunctionBuilder(defaultRouteFunctionBuilder);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
		});
	});

	it("hub add step function builder", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
		});
	});

	it("hub add route hooks", () => {
		const routeHook: HookRouteLifeCycle = {};
		const hub = createHub({
			environment: "DEV",
		})
			.addRouteHooks(routeHook);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			hooksRouteLifeCycle: [routeHook],
		});
	});

	it("hub set route hooks", () => {
		const routerFunctionBuilder = vi.fn();
		const hub = createHub({
			environment: "DEV",
		})
			.setRouterFunctionBuilder(routerFunctionBuilder);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routerFunctionBuilder,
		});
	});

	it("hub add hub hooks", () => {
		const hubHook: HookHubLifeCycle = {};
		const hub = createHub({
			environment: "DEV",
		})
			.addHubHooks(hubHook);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			hooksHubLifeCycle: [hubHook],
		});
	});

	it("hub aggregates combine plugins", () => {
		const routeHook: HookRouteLifeCycle = {
			beforeRouteExecution: () => undefined as any,
		};
		const hubHook: HookHubLifeCycle = {
			beforeStartServer: (hub) => hub,
		};

		const aggregatedHub = createHub({
			environment: "DEV",
		})
			.addRouteHooks([routeHook, {}])
			.addHubHooks([hubHook, {}])
			.plug({
				name: "test",
				hooksRouteLifeCycle: [routeHook, {}],
				hooksHubLifeCycle: [hubHook, {}],
			})
			.plug({ name: "empty" });

		expect(aggregatedHub.aggregatesHooksHubLifeCycle("beforeStartServer")).toStrictEqual([
			hubHook.beforeStartServer,
			hubHook.beforeStartServer,
		]);
		expect(aggregatedHub.aggregatesHooksRouteLifeCycle("beforeRouteExecution")).toStrictEqual([
			routeHook.beforeRouteExecution,
			routeHook.beforeRouteExecution,
		]);
	});

	it("hub set not found handler", async() => {
		const hub = createHub({ environment: "DEV" })
			.setNotfoundHandler(({ response }) => response.notFound("custom-not-found", "missing"));
		const result = await hub.notfoundHandler.definition.theFunction({}, {
			response: ResponseHelper,
			request: createTestRequest(),
		});
		expect(result).toStrictEqual(new PredictedResponse("404", "custom-not-found", "missing"));
	});

	it("hub set malformed url handler", async() => {
		const hub = createHub({ environment: "DEV" })
			.setMalformedUrlHandler(({ response }) => response.badRequest("custom-malformed"));
		const result = await hub.malformedUrlHandler.definition.theFunction({}, {
			response: ResponseHelper,
			request: createTestRequest(),
		});
		expect(result).toStrictEqual(new PredictedResponse("400", "custom-malformed", undefined));
	});

	it("hub stores and executes the default extract otherwise", () => {
		const error = new Error("invalid");
		const otherwise = (({ response, dataStructureError }) => response.unprocessableContent(
			"extract-error",
			dataStructureError,
		)) satisfies ExtractOtherwise;
		const hub = createHub({ environment: "DEV" }).setDefaultExtractOtherwise(otherwise);
		expect(hub.defaultExtractOtherwise).toBe(otherwise);
		expect(hub.defaultExtractOtherwise({
			response: ResponseHelper,
			dataStructureError: error,
			floor: {},
		}))
			.toStrictEqual(new PredictedResponse("422", "extract-error", error));
	});

	it("add body reader", () => {
		const bodyController = controlBodyAsText();

		const hub = createHub({
			environment: "DEV",
		})
			.setDefaultBodyController(bodyController);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			defaultBodyController: bodyController,
		});
	});

	it("hub set default shape codecs", () => {
		const codecs = DDataStructure.createCodecs({});
		const hub = createHub({
			environment: "DEV",
		})
			.setDefaultExtractShapeCodecs({ query: codecs });

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			defaultExtractShapeCodecs: {
				...baseHub.defaultExtractShapeCodecs,
				query: codecs,
			},
		});
	});
});
