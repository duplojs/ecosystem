import { getBuilderDefinition } from "@test-utils/builder";
import { useRouteBuilder, useCheckerBuilder, checkerStepKind, stepKind, IgnoreByRouteStoreMetadata, type PredictedResponse } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("route builder checker", () => {
	const checker = useCheckerBuilder({ options: { enabled: true } })
		.handler((input: string, { output, options }) => input && options.enabled
			? output("ok", 42)
			: output("error", "rejected"));

	it("stores the callback and metadata and narrows the rejected result", () => {
		const builder = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() })
			.check(checker, {
				input: (floor) => {
					type _Floor = DCommon.ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;
					return floor.body;
				},
				result: "ok",
				otherwise: ({ response, floor, result }) => {
					type _Floor = DCommon.ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;
					type _Information = DCommon.ExpectType<
						typeof result.information,
						"error",
						"strict"
					>;
					type _Value = DCommon.ExpectType<
						typeof result.value,
						string,
						"strict"
					>;
					return response.badRequest("rejected", {
						input: floor.body,
						reason: result.value,
					});
				},
			}, IgnoreByRouteStoreMetadata());

		const { steps } = getBuilderDefinition(builder);
		const [, step] = steps;
		expect(step).toStrictEqual({
			[checkerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				checker,
				input: expect.any(Function),
				result: "ok",
				options: undefined,
				otherwise: expect.any(Function),
				metadata: [IgnoreByRouteStoreMetadata()],
			},
		});
		type Rejection = ReturnType<typeof step.definition.otherwise>;
		type _Response = DCommon.ExpectType<
			Rejection,
			PredictedResponse<"400", "rejected", {
				readonly input: string;
				readonly reason: string;
			}>,
			"strict"
		>;
	});

	it("normalizes object options into a callback", () => {
		const options = { enabled: false };
		const builder = useRouteBuilder("GET", "/test").check(checker, {
			input: () => "input",
			result: "ok",
			options,
			otherwise: ({ response }) => response.forbidden("disabled"),
		});
		const { steps } = getBuilderDefinition(builder);
		expect(steps[0].definition.options({})).toBe(options);
	});

	it("infers the indexed success value and the floor passed to options", () => {
		const builder = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() })
			.check(checker, {
				input: ({ body }) => body,
				result: ["ok"],
				indexing: "checked",
				options: (floor) => {
					type _Floor = DCommon.ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;
					return { enabled: false };
				},
				otherwise: ({ response }) => response.forbidden("disabled"),
			})
			.cut((floor, { output }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{
						body: string;
						checked: number;
					},
					"strict"
				>;
				return output();
			});
		const { steps } = getBuilderDefinition(builder);
		expect(steps[1].definition.options({ body: "value" })).toStrictEqual({ enabled: false });
	});

	it("keeps the floor unchanged without indexing", () => {
		const builder = useRouteBuilder("GET", "/test")
			.check(checker, {
				input: () => "input",
				result: "ok",
				otherwise: ({ response }) => response.badRequest("rejected"),
			})
			.cut((floor, { output }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{},
					"strict"
				>;
				return output();
			});
		expect(getBuilderDefinition(builder).steps).toHaveLength(2);
	});
});
