import { getBuilderDefinition } from "@test-utils/builder";
import { useProcessBuilder, cutStepKind, stepKind, IgnoreByRouteStoreMetadata, type PredictedResponse, type CutStepFunctionOutput, type Request } from "@core";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("process builder cut", () => {
	it("infers responses and output data and stores only the function and metadata", () => {
		const builder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut((floor, { output, response, request }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{ body: string },
					"strict"
				>;
				type _Request = DCommon.ExpectType<
					typeof request,
					Request,
					"strict"
				>;
				if (floor.body === "forbidden") {
					return response.forbidden("forbidden");
				}
				if (floor.body === "missing") {
					return response.notFound("missing", { id: floor.body });
				}
				return output({ checked: true });
			}, IgnoreByRouteStoreMetadata());
		const { steps } = getBuilderDefinition(builder);
		const [, step] = steps;
		expect(step).toStrictEqual({
			[cutStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				theFunction: expect.any(Function),
				metadata: [IgnoreByRouteStoreMetadata()],
			},
		});
		type Output = Awaited<ReturnType<typeof step.definition.theFunction>>;
		type ExpectedOutput =
			| PredictedResponse<"403", "forbidden", undefined>
			| PredictedResponse<"404", "missing", { readonly id: "missing" }>
			| CutStepFunctionOutput<{ checked: boolean }>;
		type _Output = DCommon.ExpectType<
			Output,
			ExpectedOutput,
			"strict"
		>;
	});

	it("merges asynchronous output into the next floor", () => {
		const builder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut((floor, { output }) => Promise.resolve(output({
				body: 42,
				added: true,
			})))
			.cut((floor, { output }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{
						body: number;
						added: boolean;
					},
					"strict"
				>;
				return output();
			});
		expect(getBuilderDefinition(builder).steps).toHaveLength(3);
	});

	it("preserves the floor for response-only cuts", () => {
		const builder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut((floor, { response }) => response.forbidden("blocked"))
			.cut((floor, { output }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{ body: string },
					"strict"
				>;
				return output();
			});
		expect(getBuilderDefinition(builder).steps).toHaveLength(3);
	});

	it("supports empty output without metadata", () => {
		const builder = useProcessBuilder().cut((floor, { output }) => output());
		const { steps } = getBuilderDefinition(builder);
		type Output = Awaited<ReturnType<typeof steps[0]["definition"]["theFunction"]>>;
		type _Output = DCommon.ExpectType<
			Output,
			CutStepFunctionOutput<{}>,
			"strict"
		>;
		expect(steps[0].definition.metadata).toStrictEqual([]);
	});
});
