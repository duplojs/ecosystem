import { useTestStepFunctionBuilder } from "@test-utils/useTestStepFunctionBuilder";
import { createTestRequest } from "@test-utils/createTestRequest";
import { createCheckerStep, createPresetCheckerStep, ResponseHelper, useCheckerBuilder, useRouteBuilder, Request, Response, createPresetChecker, PredictedResponse } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createBodyReader } from "@test-utils/bodyReader";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("checker step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("response from checker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toLowerCase())
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
				},
			)
			.handler(
				(floor, { response }) => response.noContent("good"),
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
				params: { value: "" },
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "contract.otherwise", undefined),
			}),
		);
	});

	it("response from handler with body contain checker value", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toUpperCase())
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
					indexing: "checkerValue",
				},
			)
			.handler(
				({ checkerValue }, { response }) => response.ok("good", checkerValue),
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
				currentResponse: new PredictedResponse("200", "good", "TEST"),
			}),
		);
	});

	it("response from handler with body contain default checker options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "defaultOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
					indexing: "checkerValue",
				},
			)
			.handler(
				({ checkerValue }, { response }) => response.ok("good", checkerValue.option1),
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
				currentResponse: new PredictedResponse("200", "good", "defaultOption1"),
			}),
		);
	});

	it("response from handler with body contain checker options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "valueOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
					indexing: "checkerValue",
					options: {
						option1: "overrideOption1",
					},
				},
			)
			.handler(
				({ checkerValue }, { response }) => response.ok("good", checkerValue.option1),
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
				currentResponse: new PredictedResponse("200", "good", "overrideOption1"),
			}),
		);
	});

	it("response from handler with body contain checker callback options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "valueOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: ["myResult"],
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
					indexing: "checkerValue",
					options: ({ value }) => ({ option1: value }),
				},
			)
			.handler(
				({ checkerValue }, { response }) => response.ok("good", checkerValue.option1),
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

	it("response from async checker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => Promise.resolve(
					input
						? output("myResult", input.toLowerCase())
						: output("wrongResult", null),
				),
			);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ({ response }) => response.notFound("contract.otherwise"),
				},
			)
			.handler(
				(floor, { response }) => response.noContent("good"),
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
				currentResponse: new PredictedResponse("204", "good", undefined),
			}),
		);
	});

	it("passe by presetChecker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toLowerCase())
					: output("wrongResult", null),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "myResult",
				otherwise: ({ response }) => response.notFound("contract.otherwise"),
			},
		);

		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DDataStructure.string() } })
			.presetCheck(
				presetChecker,
				({ value }) => value,
			)
			.handler(
				(floor, { response }) => response.noContent("good"),
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
				params: { value: "" },
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "contract.otherwise", undefined),
			}),
		);
	});
	it("rewrites preset input before executing the checker and preserves the indexed value", async() => {
		const checkerFunction = vi.fn((input: string, { output }) => output("found", input));
		const checker = useCheckerBuilder().handler(checkerFunction);
		const rewrite = vi.fn((input: number) => `id:${input}`);
		const preset = createPresetChecker(checker, {
			result: "found",
			otherwise: ({ response }) => response.notFound("missing"),
		}).rewriteInput(rewrite).indexing("checked");
		const built = await useTestStepFunctionBuilder(createPresetCheckerStep({
			presetChecker: preset,
			input: () => 42,
			metadata: [],
		}));
		const floor = { kept: true };
		const result = await built.buildedFunction(createTestRequest(), floor);
		expect(rewrite).toHaveBeenCalledExactlyOnceWith(42);
		expect(checkerFunction).toHaveBeenCalledWith("id:42", expect.any(Object));
		expect(result).toStrictEqual({
			kept: true,
			checked: "id:42",
		});
		expect(floor).toStrictEqual({ kept: true });
	});

	it("passes direct preset input unchanged and calls otherwise with the rejected result", async() => {
		const checker = useCheckerBuilder().handler((input: { id: number }, { output }) => output("missing", input));
		const otherwise = vi.fn(() => ResponseHelper.notFound("missing", { reason: "absent" }));
		const preset = createPresetChecker(checker, {
			result: [],
			otherwise,
		});
		const input = { id: 42 };
		const built = await useTestStepFunctionBuilder(createPresetCheckerStep({
			presetChecker: preset,
			input: () => input,
			metadata: [],
		}));
		const result = await built.buildedFunction(createTestRequest(), {});
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			response: ResponseHelper,
			result: expect.objectContaining({
				information: "missing",
				value: input,
			}),
		}));
		expect(result).toBe(otherwise.mock.results[0]?.value);
	});

	it("passes the floor and rejected checker result to otherwise", async() => {
		const checker = useCheckerBuilder().handler((input: string, { output }) => output("missing", input));
		const otherwise = vi.fn(({ response, floor, result }) => response.badRequest("invalid", {
			value: result.value,
			context: floor.context,
		}));
		const step = createCheckerStep({
			checker,
			input: () => "value",
			result: [],
			otherwise,
			metadata: [],
		});
		const built = await useTestStepFunctionBuilder(step);
		const floor = { context: "kept" };
		const result = await built.buildedFunction(createTestRequest(), floor);
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			floor,
			result: expect.objectContaining({
				information: "missing",
				value: "value",
			}),
		}));
		expect(result).toStrictEqual(new PredictedResponse("400", "invalid", {
			value: "value",
			context: "kept",
		}));
	});
});
