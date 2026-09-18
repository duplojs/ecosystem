import { type ProcessStep, processStepKind, stepKind, useProcessBuilder, type Request, usePreflightBuilder, type PreflightBuilder, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

describe("preflight builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.exports();

		const preflightBuilder = usePreflightBuilder()
			.exec(process, undefined, IgnoreByRouteStoreMetadata());

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								metadata: [IgnoreByRouteStoreMetadata()],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{}
			>,
			"strict"
		>;
	});

	it("exec with option", () => {
		const process = useProcessBuilder({
			options: {
				test: true,
			},
		})
			.exports();

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { options: { test: false } });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								options: { test: false },
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: { test: boolean };
							readonly imports: undefined;
							readonly metadata: readonly [];
						}>,
					];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{}
			>,
			"strict"
		>;
	});

	it("exec with import", () => {
		const process = useProcessBuilder()
			.extract({
				query: DDataStructure.number(),
				body: DDataStructure.string(),
			})
			.exports(["body"]);

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { imports: ["body"] });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								imports: ["body"],
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
							readonly metadata: readonly [];
						}>,
					];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{ body: string }
			>,
			"strict"
		>;
	});

	it("exec with callback option", () => {
		const processWithExport = useProcessBuilder()
			.extract({
				query: DDataStructure.number(),
				body: DDataStructure.string(),
			})
			.exports(["body"]);

		const process = useProcessBuilder({
			options: {
				test: true,
			},
		})
			.exports();

		const preflightBuilder = usePreflightBuilder()
			.exec(
				processWithExport,
				{
					imports: ["body"],
				},
			)
			.exec(
				process,
				{
					options: (floor) => {
						type Check = DCommon.ExpectType<
							typeof floor,
							{
								body: string;
							},
							"strict"
						>;

						return {
							test: false,
						};
					},
				},
			);

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: processWithExport,
								imports: ["body"],
								metadata: [],
							},
						},
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								options: expect.any(Function),
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof processWithExport;
							readonly options: undefined;
							readonly imports: readonly ["body"];
							readonly metadata: readonly [];
						}>,
						ProcessStep<{
							readonly process: typeof process;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly imports: undefined;
							readonly metadata: readonly [];
						}>,
					];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{ body: string }
			>,
			"strict"
		>;
	});

	it("exec with multi import", () => {
		const process = useProcessBuilder()
			.extract({
				query: DDataStructure.number(),
				body: DDataStructure.string(),
			})
			.exports(["body", "query"]);

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { imports: ["body", "query"] });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[DCommon.builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: process,
								imports: ["body", "query"],
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = DCommon.ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body", "query"];
							readonly metadata: readonly [];
						}>,
					];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{
					body: string;
					query: number;
				}
			>,
			"strict"
		>;
	});
});
