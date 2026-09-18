import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { aggregateStepContract, defaultFluxStreamSchema, IgnoreByCodeGeneratorMetadata } from "@plugin-codeGenerator";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";

describe("stepsToStructure", () => {
	const process1 = useProcessBuilder()
		.extract({
			headers: {
				header1: DDataStructure.string(),
				header2: DDataStructure.number(),
			},
			body: DDataStructure.string(),
		})
		.exports();

	const process2 = useProcessBuilder()
		.extract({})
		.exports();

	const ignoredProcess = useProcessBuilder({
		metadata: [IgnoreByCodeGeneratorMetadata()],
	})
		.extract({ query: { ignoredQuery: DDataStructure.string() } })
		.exports();

	const route = useRouteBuilder("GET", "/test/{ignoredParams}")
		.extract({
			headers: DDataStructure.object({
				header3: DDataStructure.string(),
				header4: DDataStructure.number(),
			}),
			body: {
				prop1: DDataStructure.string(),
				prop2: DDataStructure.number(),
			},
		})
		.extract(
			{
				params: {
					ignoredParams: DDataStructure.string(),
				},
			},
			undefined,
			IgnoreByCodeGeneratorMetadata(),
		)
		.exec(process1)
		.exec(process2)
		.exec(ignoredProcess)
		.presetCheck(testPresetChecker, () => "")
		.handler(
			[
				ResponseContract.noContent("test"),
				ResponseContract.serverSentEvents("sse", DDataStructure.object({ test: DDataStructure.string() })),
				ResponseContract.stream("stream", DDataStructure.string()),
				ResponseContract.streamText("streamText"),
			],
			(__, { response }) => response("test"),
		);

	it("generate endpoint and entrypoint schema", () => {
		const result = aggregateStepContract(route.definition.steps, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual(
			omitFunctions({
				endpointContract: [
					DDataStructure.object({
						code: DDataStructure.literal(defaultExtractContract.code),
						information: DDataStructure.literal(defaultExtractContract.information),
						body: DDataStructure.undefined(),
					}),
					DDataStructure.object({
						code: DDataStructure.literal("404"),
						information: DDataStructure.literal("notFound"),
						body: DDataStructure.undefined(),
					}),
					DDataStructure.object({
						code: DDataStructure.literal("204"),
						information: DDataStructure.literal("test"),
						body: DDataStructure.undefined(),
					}),
					DDataStructure.object({
						code: DDataStructure.literal("200"),
						information: DDataStructure.literal("sse"),
						body: DDataStructure.undefined(),
						events: DDataStructure.object({
							message: DDataStructure.object({ test: DDataStructure.string() }),
						}),
					}),
					DDataStructure.object({
						code: DDataStructure.literal("200"),
						information: DDataStructure.literal("stream"),
						body: DDataStructure.undefined(),
						flux: defaultFluxStreamSchema,
					}),
					DDataStructure.object({
						code: DDataStructure.literal("200"),
						information: DDataStructure.literal("streamText"),
						body: DDataStructure.undefined(),
						flux: DDataStructure.string(),
					}),
					DDataStructure.object({
						code: DDataStructure.literal(defaultExtractContract.code),
						information: DDataStructure.literal(defaultExtractContract.information),
						body: DDataStructure.undefined(),
					}),
					DDataStructure.object({
						code: DDataStructure.literal(defaultExtractContract.code),
						information: DDataStructure.literal(defaultExtractContract.information),
						body: DDataStructure.undefined(),
					}),
				],
				entrypointContract: {
					headers: {
						header1: DDataStructure.string(),
						header2: DDataStructure.number(),
						header3: DDataStructure.string(),
						header4: DDataStructure.number(),
					},
					body: {
						prop1: DDataStructure.string(),
						prop2: DDataStructure.number(),
					},
					params: {},
					query: {},
				},

			}),
		);
	});
});
