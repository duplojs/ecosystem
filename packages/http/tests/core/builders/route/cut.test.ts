import { cutStepKind, extractStepKind, ResponseContract, type RouteBuilder, stepKind, useRouteBuilder, type Request, type CutStep, type CutStepFunctionParams, type PredictedResponse, type CutStepFunctionOutput, type ExtractStep, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("route builder cut method", () => {
	it("cut", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
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
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
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
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DDataStructure.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { response }) => response("test"),
			);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
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
