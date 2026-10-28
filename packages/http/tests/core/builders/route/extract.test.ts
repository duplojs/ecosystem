import { getBuilderDefinition } from "@test-utils/builder";
import { type PredictedResponse, type ExtractStep, extractStepKind, type RouteBuilder, stepKind, useRouteBuilder, type Request, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import type * as DString from "@duplojs/lang/string";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("route builder extract method", () => {
	it("extract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() }, undefined, IgnoreByRouteStoreMetadata());

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						preflightSteps: [],
						bodyController: null,
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									otherwise: undefined,
									shape: {
										body: expect.objectContaining({
											[DDataStructure.typeStructureKind.runTimeKey]: null,
										}),
									},
									metadata: [IgnoreByRouteStoreMetadata()],
								},
							},
						],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DDataStructure.TypeStructure<string, readonly []>;
							};
							readonly otherwise: undefined;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string }
			>,
			"strict"
		>;
	});

	it("extract with custom otherwise", () => {
		const builder = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() }, ({ response, floor, dataStructureError }) => {
				type _Floor = DCommon.ExpectType<
					typeof floor,
					{},
					"strict"
				>;
				type _Error = DCommon.ExpectType<
					typeof dataStructureError,
					DDataStructure.Error | Error,
					"strict"
				>;
				return response.forbidden("invalid-input", { reason: dataStructureError.message });
			});
		const { steps } = getBuilderDefinition(builder);
		expect(steps[0].definition.otherwise).toEqual(expect.any(Function));
		type Output = ReturnType<NonNullable<typeof steps[0]["definition"]["otherwise"]>>;
		type _Output = DCommon.ExpectType<
			Output,
			PredictedResponse<
				"403",
				"invalid-input",
				{ readonly reason: string }
			>,
			"strict"
		>;
	});

	it("extract with deep extract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: { test: DDataStructure.string() } });

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						bodyController: null,
						preflightSteps: [],
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									otherwise: undefined,
									shape: {
										body: {
											test: expect.objectContaining({
												[DDataStructure.typeStructureKind.runTimeKey]: null,
											}),
										},
									},
									metadata: [],
								},
							},
						],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: {
									test: DDataStructure.TypeStructure<string, readonly []>;
								};
							};
							readonly otherwise: undefined;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ test: string }
			>,
			"strict"
		>;
	});

	it("extract with huge object", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({
				body: DDataStructure.object({
					prop1: DDataStructure.array(DDataStructure.string()),
					prop2: DDataStructure.array(DDataStructure.bigint()),
					prop3: DDataStructure.array(DDataStructure.boolean()),
					prop4: DDataStructure.array(DDataStructure.string([DDataStructure.email()])),
					prop5: DDataStructure.array(DDataStructure.number()),
					prop6: DDataStructure.array(DDataStructure.undefined()),
					prop7: DDataStructure.array(DDataStructure.null()),
					prop8: DDataStructure.object({
						template: DDataStructure.string(
							[
								DDataStructure.refine(
									(data): data is "test-1" | "test-test" | "test-3" => true,
								),
							],
						),
						union: DCommon.pipe(
							DDataStructure.union([
								DDataStructure.string([DDataStructure.email()]),
								DDataStructure.lazy(() => DDataStructure.null()),
								DDataStructure.object({
									test: DDataStructure.array(DDataStructure.optional(DDataStructure.string())),
								}),
							]),
							DDataStructure.array,
							DDataStructure.optional,
							DDataStructure.nullable,
						),
					}),
				}),
			});

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						bodyController: null,
						preflightSteps: [],
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									otherwise: undefined,
									shape: {
										body: expect.objectContaining({
											[DDataStructure.objectStructureKind.runTimeKey]: null,
										}),
									},
									metadata: [],
								},
							},
						],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof routeBuilder extends RouteBuilder<any, infer FF>
				? FF
				: never,
			{
				body: {
					readonly prop1: readonly string[];
					readonly prop2: readonly bigint[];
					readonly prop3: readonly boolean[];
					readonly prop4: readonly (string & DString.Email)[];
					readonly prop5: readonly number[];
					readonly prop6: readonly undefined[];
					readonly prop7: readonly null[];
					readonly prop8: {
						readonly template: "test-1" | "test-test" | "test-3";
						readonly union?:
						| readonly (
							| (string & DString.Email)
							| { readonly test: readonly (string | undefined)[] }
							| null
						)[]
						| null
						| undefined;
					};
				};
			},
			"strict"
		>;
	});
});
