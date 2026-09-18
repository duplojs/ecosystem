import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { aggregateStepContract, IgnoreByOpenApiGeneratorMetadata } from "@plugin-openApiGenerator";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";

describe("aggregateStepContract", () => {
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
		metadata: [IgnoreByOpenApiGeneratorMetadata()],
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
			IgnoreByOpenApiGeneratorMetadata(),
		)
		.exec(process1)
		.exec(process2)
		.exec(ignoredProcess)
		.presetCheck(testPresetChecker, () => "")
		.handler(
			ResponseContract.noContent("test"),
			(__, { response }) => response("test"),
		);

	it("generate entrypoint schema and aggregate endpoint", () => {
		const result = aggregateStepContract(route.definition.steps, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual(
			omitFunctions({
				endpointContract: [
					ResponseContract.unprocessableContent(defaultExtractContract.information),
					ResponseContract.notFound("notFound"),
					ResponseContract.noContent("test"),
					ResponseContract.unprocessableContent(defaultExtractContract.information),
					ResponseContract.unprocessableContent(defaultExtractContract.information),
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
