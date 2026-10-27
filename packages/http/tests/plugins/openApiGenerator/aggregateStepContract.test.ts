import { useProcessBuilder, useRouteBuilder, createMetadata } from "@core";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { aggregateStepContract, IgnoreByOpenApiGeneratorMetadata, OpenApiEndpointContractMetadata } from "@plugin-openApiGenerator";
import { omitFunctions } from "@test-utils/omitFunction";

describe("aggregateStepContract", () => {
	const success = {
		code: "200",
		information: "documented",
		body: DDataStructure.string(),
	} as const;
	const fallback = {
		code: "422",
		information: "extract-error",
	} as const;

	it("collects step and process metadata through nested processes", () => {
		const inner = useProcessBuilder({ metadata: [OpenApiEndpointContractMetadata(success)] })
			.extract({ headers: { token: DDataStructure.string() } })
			.exports();
		const outer = useProcessBuilder()
			.exec(inner)
			.extract({ query: { page: DDataStructure.number() } })
			.exports();
		const route = useRouteBuilder("GET", "/test")
			.exec(outer)
			.handler((floor, { response }) => response.noContent("runtime"), OpenApiEndpointContractMetadata({
				code: "204",
				information: "done",
			}));
		const result = aggregateStepContract(route.definition.steps);
		expect(omitFunctions(result)).toStrictEqual(omitFunctions({
			entrypointContract: {
				body: {},
				headers: { token: DDataStructure.string() },
				params: {},
				query: { page: DDataStructure.number() },
			},
			endpointContract: [
				{
					code: "204",
					information: "done",
				},
				fallback,
				fallback,
				success,
			],
		}));
	});

	it("selects the fallback separately for each extract without output metadata", () => {
		const unrelated = createMetadata("unrelated");
		const route = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() }, undefined, unrelated())
			.extract({}, undefined, OpenApiEndpointContractMetadata(success))
			.extract({})
			.handler((floor, { response }) => response.noContent("done"));
		expect(
			aggregateStepContract(
				route.definition.steps,
			).endpointContract,
		).toStrictEqual(
			[fallback, success, fallback],
		);
		const custom = {
			code: "400",
			information: "invalid",
		} as const;
		expect(
			aggregateStepContract(
				route.definition.steps,
				{
					defaultExtractMetadata: OpenApiEndpointContractMetadata(
						custom,
					),
				},
			).endpointContract,
		)
			.toStrictEqual(
				[custom, success, custom],
			);
	});

	it("does not infer runtime responses and does not replace a fallback with route metadata", () => {
		const route = useRouteBuilder("GET", "/test")
			.extract({})
			.cut((floor, { response }) => response.forbidden("runtime-only"))
			.handler((floor, { response }) => response.noContent("runtime-only"));
		expect(
			aggregateStepContract(
				route.definition.steps,
				{
					metadata: [
						OpenApiEndpointContractMetadata(
							success,
						),
					],
				},
			).endpointContract,
		)
			.toStrictEqual(
				[fallback, success],
			);
	});

	it("accepts arrays of endpoint metadata and preserves input extraction", () => {
		const route = useRouteBuilder("GET", "/test/{id}")
			.extract({ params: { id: DDataStructure.string() } }, undefined, OpenApiEndpointContractMetadata(
				[success, fallback],
			))
			.handler((floor, { response }) => response.noContent("done"));
		const result = aggregateStepContract(route.definition.steps);
		expect(result.endpointContract).toStrictEqual([success, fallback]);
		expect(
			omitFunctions(
				result.entrypointContract.params,
			),
		).toStrictEqual(
			omitFunctions(
				{ id: DDataStructure.string() },
			),
		);
	});

	it("excludes marked steps and processes and all their descendants", () => {
		const ignored = useProcessBuilder(
			{
				metadata: [
					IgnoreByOpenApiGeneratorMetadata(),
					OpenApiEndpointContractMetadata(
						success,
					),
				],
			},
		)
			.extract(
				{ body: DDataStructure.string() },
			)
			.exports();
		const visible = useProcessBuilder()
			.extract({ headers: { token: DDataStructure.string() } })
			.exports();
		const route = useRouteBuilder("GET", "/test")
			.exec(ignored)
			.exec(visible, undefined, IgnoreByOpenApiGeneratorMetadata())
			.extract(
				{ query: { ignored: DDataStructure.string() } },
				undefined,
				IgnoreByOpenApiGeneratorMetadata(),
				OpenApiEndpointContractMetadata(
					success,
				),
			)
			.handler((floor, { response }) => response.noContent(
				"done",
			), IgnoreByOpenApiGeneratorMetadata(), OpenApiEndpointContractMetadata(
				success,
			));
		expect(aggregateStepContract(route.definition.steps)).toStrictEqual({
			entrypointContract: {
				body: {},
				headers: {},
				params: {},
				query: {},
			},
			endpointContract: [],
		});
	});

	it("merges object shapes and keeps the first full structure", () => {
		const firstBody = DDataStructure.string();
		const route = useRouteBuilder("POST", "/test")
			.extract({
				body: firstBody,
				headers: { first: DDataStructure.string() },
			})
			.extract({
				body: DDataStructure.number(),
				headers: DDataStructure.object({ second: DDataStructure.number() }),
			})
			.extract({ headers: DDataStructure.string() })
			.handler((floor, { response }) => response.noContent("done"));
		const result = aggregateStepContract(route.definition.steps);
		expect(result.entrypointContract.body).toBe(firstBody);
		expect(omitFunctions(result.entrypointContract.headers)).toStrictEqual(omitFunctions({
			first: DDataStructure.string(),
			second: DDataStructure.number(),
		}));
	});
});
