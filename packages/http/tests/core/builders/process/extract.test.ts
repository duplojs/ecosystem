import { type ExtractStep, extractStepKind, type ProcessBuilder, stepKind, useProcessBuilder, type Request, ResponseContract, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

describe("process builder extract method", () => {
	it("extract", () => {
		const processBuilder = useProcessBuilder()
			.extract(
				{ body: DDataStructure.string() },
				undefined,
				IgnoreByRouteStoreMetadata(),
			);

		expect({ ...processBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						options: undefined,
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
									shape: {
										body: expect.objectContaining({
											[DDataStructure.typeStructureKind.runTimeKey]: null,
										}),
									},
									metadata: [IgnoreByRouteStoreMetadata()],
								},
							},
						],
						metadata: [],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DDataStructure.TypeStructure<string, readonly []>;
							};
							readonly responseContract: undefined;
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

	it("extract with custom contract", () => {
		const processBuilder = useProcessBuilder()
			.extract(
				{ body: DDataStructure.string() },
				ResponseContract.forbidden("test"),
			);

		expect({ ...processBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						options: undefined,
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "403",
									}),
									shape: {
										body: expect.objectContaining({
											[DDataStructure.typeStructureKind.runTimeKey]: null,
										}),
									},
									metadata: [],
								},
							},
						],
						metadata: [],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DDataStructure.TypeStructure<string, readonly []>;
							};
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string }
			>,
			"strict"
		>;
	});

	it("extract with deep extract", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: { test: DDataStructure.string() } });

		expect({ ...processBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						options: undefined,
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
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
						metadata: [],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: {
									test: DDataStructure.TypeStructure<string, readonly []>;
								};
							};
							readonly responseContract: undefined;
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
		const processBuilder = useProcessBuilder()
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
						template: DDataStructure.string([DDataStructure.refine((data): data is "test-1" | "test-test" | "test-3" => true)]),
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

		expect({ ...processBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[DCommon.builderKind.runTimeKey]: {
						hooks: [],
						options: undefined,
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
									shape: {
										body: expect.objectContaining({
											[DDataStructure.objectStructureKind.runTimeKey]: null,
										}),
									},
									metadata: [],
								},
							},
						],
						metadata: [],
					},
				}),
			);

		type Check = DCommon.ExpectType<
			typeof processBuilder extends ProcessBuilder<any, infer FF>
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
