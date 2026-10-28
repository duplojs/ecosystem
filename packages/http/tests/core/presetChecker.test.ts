import { type CheckerFunctionOutput, checkerOutputKind, createPresetChecker, useCheckerBuilder, presetCheckerKind, ResponseHelper, useRouteBuilder, type RouteDeclarationToContract, type GetPresetCheckerInput, type GetPresetCheckerIndex, type GetPresetCheckerInformation, type PredictedResponse } from "@core";
import * as DCommon from "@duplojs/lang/common";

describe("presetChecker", () => {
	const checker = useCheckerBuilder({ options: DCommon.forward<{ enabled: boolean }>({ enabled: true }) })
		.handler((input: string, { output, options }) => input && options.enabled
			? output("found", input)
			: output("missing", null));

	it("keeps the otherwise callback and infers its response", () => {
		const preset = createPresetChecker(checker, {
			result: "found",
			otherwise: ({ response, result }) => {
				type _Result = DCommon.ExpectType<
					typeof result.information,
					"missing",
					"strict"
				>;
				type _Value = DCommon.ExpectType<
					typeof result.value,
					null,
					"strict"
				>;
				return response.notFound("missing", result.value);
			},
		});
		expect(preset).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: "found",
				otherwise: expect.any(Function),
			},
			indexing: expect.any(Function),
			rewriteInput: expect.any(Function),
			options: expect.any(Function),
		});
		type Output = ReturnType<typeof preset.definition.otherwise>;
		type _Output = DCommon.ExpectType<
			Output,
			PredictedResponse<"404", "missing", null>,
			"strict"
		>;
		type _Input = DCommon.ExpectType<
			GetPresetCheckerInput<typeof preset>,
			string,
			"strict"
		>;
		type _Index = DCommon.ExpectType<
			GetPresetCheckerIndex<typeof preset>,
			never,
			"strict"
		>;
		type _Information = DCommon.ExpectType<
			GetPresetCheckerInformation<typeof preset>,
			"found",
			"strict"
		>;
		const response = preset.definition.otherwise({
			response: ResponseHelper,
			result: checkerOutputKind.setTo({
				information: "missing" as const,
				value: null,
			}, null),
		});
		expect(response).toStrictEqual(ResponseHelper.notFound("missing", null));
	});

	it("chains immutable indexing, input rewriting and options while preserving otherwise", () => {
		const otherwise = () => ResponseHelper.forbidden("disabled");
		const original = createPresetChecker(checker, {
			result: ["found"],
			otherwise,
		});
		const rewriteInput = ({ value }: { value: string }) => value;
		const preset = original.indexing("value").rewriteInput(rewriteInput).options({ enabled: false });

		expect(preset.definition).toStrictEqual({
			checker,
			result: ["found"],
			otherwise,
			indexing: "value",
			rewriteInput,
			options: { enabled: false },
		});
		expect(original.definition).toStrictEqual({
			checker,
			result: ["found"],
			otherwise,
		});
		type _Input = DCommon.ExpectType<
			GetPresetCheckerInput<typeof preset>,
			{ value: string },
			"strict"
		>;
		type _Index = DCommon.ExpectType<
			GetPresetCheckerIndex<typeof preset>,
			"value",
			"strict"
		>;
		type _Options = DCommon.ExpectType<
			typeof preset.definition.options,
			{ readonly enabled: false },
			"strict"
		>;
		type _Otherwise = DCommon.ExpectType<
			typeof preset.definition.otherwise,
			typeof otherwise,
			"strict"
		>;
	});

	it("replaces initial options, indexing and rewriting", () => {
		const otherwise = () => ResponseHelper.notFound("missing");
		const original = createPresetChecker(checker, {
			result: "found",
			otherwise,
			indexing: "old",
			options: { enabled: true },
			rewriteInput: (input: unknown) => "initial",
		});
		const rewritten = original.options(
			{ enabled: false },
		).indexing(
			"new",
		).rewriteInput(
			(input: number) => `${input}`,
		);
		expect(rewritten.definition.rewriteInput(42)).toBe("42");
		expect(rewritten.definition.options).toStrictEqual({ enabled: false });
		expect(rewritten.definition.indexing).toBe("new");
		expect(rewritten.definition.otherwise).toBe(otherwise);
		expect(original.definition.options).toStrictEqual({ enabled: true });
		type _Input = DCommon.ExpectType<
			GetPresetCheckerInput<typeof rewritten>,
			number,
			"strict"
		>;
	});

	it("preserves explicit checker and definition type arguments", () => {
		const definition = {
			result: "found",
			otherwise: () => ResponseHelper.notFound("missing"),
		} as const;
		const preset = createPresetChecker(checker, definition);
		type _Information = DCommon.ExpectType<
			GetPresetCheckerInformation<typeof preset>,
			"found",
			"strict"
		>;
		expect(preset.definition).toStrictEqual({
			...definition,
			checker,
		});
	});

	it("narrows tuple selections for asynchronous checkers using method syntax", () => {
		const asynchronousChecker = useCheckerBuilder()
			.handler((input: string, { output }) => Promise.resolve(input
				? output("found", input)
				: output("missing", { id: input })));
		const preset = createPresetChecker(asynchronousChecker, {
			result: ["found"],
			otherwise({ response, result }) {
				type _Result = DCommon.ExpectType<
					typeof result,
					CheckerFunctionOutput<"missing", { id: string }>,
					"strict"
				>;
				return response.notFound("missing", result.value.id);
			},
		});
		type _Information = DCommon.ExpectType<
			GetPresetCheckerInformation<typeof preset>,
			readonly ["found"],
			"strict"
		>;
		type Output = ReturnType<typeof preset.definition.otherwise>;
		type _Output = DCommon.ExpectType<
			Output,
			PredictedResponse<"404", "missing", string>,
			"strict"
		>;
		expect(preset.definition.result).toStrictEqual(["found"]);
	});

	it("preserves rejection unions and response inference in route contracts after chaining", () => {
		const checker = useCheckerBuilder()
			.handler((input: string, { output }) => {
				if (input === "found") {
					return output("found", input);
				}
				if (input === "blocked") {
					return output("blocked", { reason: "blocked" });
				}
				return output("missing", null);
			});
		const preset = createPresetChecker(checker, {
			result: "found",
			otherwise: ({ response, result }) => {
				type ExpectedResult =
					| CheckerFunctionOutput<"blocked", { reason: string }>
					| CheckerFunctionOutput<"missing", null>;
				type _Result = DCommon.ExpectType<
					typeof result,
					ExpectedResult,
					"strict"
				>;
				return result.information === "blocked"
					? response.forbidden("blocked", result.value.reason)
					: response.notFound("missing", result.value);
			},
		}).indexing("checked").rewriteInput((input: { id: string }) => input.id);
		const route = useRouteBuilder("GET", "/test")
			.presetCheck(preset, () => ({ id: "found" }))
			.handler((floor, { response }) => response.ok("done", floor.checked));
		type Responses = RouteDeclarationToContract<typeof route>["responses"];
		type ExpectedResponses =
			| {
				readonly code: "403";
				readonly information: "blocked";
				readonly body: string;
			}
			| {
				readonly code: "404";
				readonly information: "missing";
				readonly body: null;
			}
			| {
				readonly code: "200";
				readonly information: "done";
				readonly body: string;
			};
		type _Responses = DCommon.ExpectType<
			Responses,
			ExpectedResponses,
			"strict"
		>;
		expect(route.definition.steps[0].definition.presetChecker).toBe(preset);
	});

	it("keeps all results when none are accepted and never when all are accepted", () => {
		const rejected = createPresetChecker(checker, {
			result: [],
			otherwise: ({ response, result }) => {
				type ExpectedResult =
					| CheckerFunctionOutput<"found", string>
					| CheckerFunctionOutput<"missing", null>;
				type _Result = DCommon.ExpectType<
					typeof result,
					ExpectedResult,
					"strict"
				>;
				return response.badRequest("rejected", result.value);
			},
		});
		const accepted = createPresetChecker(checker, {
			result: ["found", "missing"],
			otherwise: ({ response, result }) => {
				type _Result = DCommon.ExpectType<
					typeof result,
					never,
					"strict"
				>;
				return response.internalServerError("unreachable");
			},
		});
		type Output = ReturnType<typeof rejected.definition.otherwise>;
		type _Output = DCommon.ExpectType<
			Output,
			PredictedResponse<"400", "rejected", string | null>,
			"strict"
		>;
		expect(rejected.definition.result).toStrictEqual([]);
		expect(accepted.definition.result).toStrictEqual(["found", "missing"]);
	});
});
