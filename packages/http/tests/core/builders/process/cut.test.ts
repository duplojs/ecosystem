import { cutStepKind, extractStepKind, ResponseContract, type ProcessBuilder, stepKind, useProcessBuilder, type Request, type CutStep, type CutStepFunctionParams, type PredictedResponse, type CutStepFunctionOutput, type ExtractStep, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("process builder cut method", () => {
	it("cut", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					type Check = DCommon.ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;

					if (floor.body) {
						return response("test");
					}

					return output();
				},
				IgnoreByRouteStoreMetadata(),
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
								}),
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
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									PredictedResponse<"403", "test", undefined>
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{}>
							>;
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

	it("cut with multi contract", () => {
		const processBuilder = useProcessBuilder()
			.cut(
				[ResponseContract.forbidden("test"), ResponseContract.notFound("notF", DDataStructure.string())],
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					} else if (false.valueOf()) {
						return response("notF", "test");
					}

					return output();
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: [
									expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "403",
									}),
									expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "404",
									}),
								],
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
						CutStep<{
							readonly responseContract: readonly [
								ResponseContract.Contract<
									"403",
									"test",
									DDataStructure.TypeStructure<undefined, readonly []>
								>,
								ResponseContract.Contract<
									"404",
									"notF",
									DDataStructure.TypeStructure<string, readonly []>
								>,
							];
							theFunction(
								floor: {},
								param: CutStepFunctionParams<
									| PredictedResponse<"403", "test", undefined>
									| PredictedResponse<"404", "notF", string>
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| PredictedResponse<"404", "notF", string>
								| CutStepFunctionOutput<{}>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{}
			>,
			"strict"
		>;
	});

	it("cut with output data", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					}

					return output({ test: true });
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
								}),
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									| PredictedResponse<"403", "test", undefined>
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					test: boolean;
					body: string;
				}
			>,
			"strict"
		>;
	});

	it("cut with multi output data", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					} else if (false.valueOf()) {
						return output({ toto: "string" });
					}

					return output({ test: true });
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
								}),
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									| PredictedResponse<"403", "test", undefined>
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
								| CutStepFunctionOutput<{ toto: string }>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
					test: boolean;
				} | {
					body: string;
					toto: string;
				}
			>,
			"strict"
		>;
	});

	it("cut without output", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { response }) => response("test"),
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					option: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
								}),
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									| PredictedResponse<"403", "test", undefined>
								>
							): DCommon.MaybePromise<
								| PredictedResponse<"403", "test", undefined>
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
});
