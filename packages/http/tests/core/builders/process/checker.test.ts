import { checkerStepKind, extractStepKind, ResponseContract, type ProcessBuilder, stepKind, useCheckerBuilder, useProcessBuilder, type Request, type CheckerStep, type ExtractStep, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";

describe("process builder checker method", () => {
	it("check", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.check(
				checker,
				{
					input: ({ body }) => {
						type Check = DCommon.ExpectType<
							typeof body,
							string,
							"strict"
						>;

						return body;
					},
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
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
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
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
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: undefined;
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
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

	it("check with options", () => {
		const checker = useCheckerBuilder({ options: { test: true } })
			.handler(
				(input: string, { output, options }) => options.test
					? output("ok", true)
					: output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.check(
				checker,
				{
					input: DObject.getProperty("body"),
					options: { test: false },
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
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
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								options: {
									test: false,
								},
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
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
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: {
								test: boolean;
							};
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
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

	it("check with callback options", () => {
		const checker = useCheckerBuilder({ options: { test: true } })
			.handler(
				(input: string, { output, options }) => options.test
					? output("ok", true)
					: output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.check(
				checker,
				{
					input: DObject.getProperty("body"),
					options: (floor) => {
						type Check = DCommon.ExpectType<
							typeof floor,
							{ body: string },
							"strict"
						>;

						return { test: false };
					},
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
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
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								options: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
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
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
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

	it("check with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.check(
				checker,
				{
					input: DObject.getProperty("body"),
					result: "ok",
					indexing: "myValueCheck",
					otherwise: ResponseContract.badRequest("test"),
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
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								indexing: "myValueCheck",
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
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
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: undefined;
							readonly indexing: "myValueCheck";
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
					myValueCheck: boolean;
				}
			>,
			"strict"
		>;
	});

	it("with metadata", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DDataStructure.string() })
			.check(
				checker,
				{
					input: DObject.getProperty("body"),
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
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
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
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
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: undefined;
							readonly result: "ok";
							readonly indexing: undefined;
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DDataStructure.TypeStructure<undefined, readonly []>
							>;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
				}
			>,
			"strict"
		>;
	});
});
