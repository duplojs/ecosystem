import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DGenerator from "@scripts/generator";

describe("loopAccumulator", () => {
	it("infers the accumulator and mixed outputs lazily", () => {
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(
			0,
			(params) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof params.accumulator, number, "strict">;

				observer(params);

				return params.count === 0
					? params.next(params.accumulator + 1, params.accumulator, "value", undefined)
					: params.exit(params.accumulator);
			},
		);

		expect(observer).not.toHaveBeenCalled();
		expect(DArray.from(result)).toStrictEqual([0, "value", 1]);
		expect(observer).toHaveBeenCalledTimes(2);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			count: 1,
			accumulator: 1,
		}));

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number | "value", unknown, unknown>, "strict">;
	});

	it("infers never without outputs", () => {
		const result = DGenerator.loopAccumulator(
			0,
			({ accumulator, count, next, exit }) => (
				count === 0 ? next(accumulator + 1) : exit()
			),
		);

		expect(DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<never, unknown, unknown>, "strict">;
	});

	it("preserves a wrapped accumulator type", () => {
		interface Accumulator {
			total: number;
			previous?: number;
		}

		const initialAccumulator: Accumulator = { total: 0 };
		const result = DGenerator.loopAccumulator(
			DGenerator.loopAccumulatorFrom(initialAccumulator),
			({ accumulator, count, next, exit }) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, Accumulator, "strict">;

				// @ts-expect-error the accumulator must retain its initial type
				next({ total: "invalid" });

				return count === 2
					? exit(accumulator)
					: next({
						total: accumulator.total + 1,
						previous: accumulator.total,
					});
			},
		);

		expect(DArray.from(result)).toStrictEqual([
			{
				total: 2,
				previous: 1,
			},
		]);
		expect(initialAccumulator).toStrictEqual({ total: 0 });

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<Accumulator, unknown, unknown>, "strict">;
	});

	it("restricts declared output types", () => {
		const result = DGenerator.loopAccumulator(
			0,
			(params: DGenerator.LoopAccumulatorParams<number, number>) => {
				// @ts-expect-error next must use the declared output type
				params.next(params.accumulator, "invalid");
				// @ts-expect-error exit must use the declared output type
				params.exit("invalid");

				return params.count === 0
					? params.next(params.accumulator + 1, 1)
					: params.exit(2, undefined, 3);
			},
		);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<1 | 2 | 3, unknown, unknown>, "strict">;
	});

	it("infers never when no outputs are emitted", () => {
		const result = DGenerator.loopAccumulator(0, ({ accumulator, count, next, exit }) => (
			count === 0 ? next(accumulator + 1) : exit()
		));

		expect(DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<never, unknown, unknown>, "strict">;
	});

	it("infers mixed outputs without explicit types", () => {
		const result = DGenerator.loopAccumulator(0, ({ accumulator, count, next, exit }) => count === 0
			? next(accumulator + 1, accumulator, "value", undefined)
			: exit(accumulator));

		expect(DArray.from(result)).toStrictEqual([0, "value", 1]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number | "value", unknown, unknown>, "strict">;
	});

	it("preserves promised outputs in a synchronous generator", () => {
		const output = Promise.resolve(undefined);
		const result = DGenerator.loopAccumulator(0, ({ exit }) => exit(output));

		expect(DArray.from(result)).toStrictEqual([output]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<Promise<undefined>, unknown, unknown>, "strict">;
	});

	it("does not expose previousOutput in callback parameters", () => {
		const result = DGenerator.loopAccumulator(0, (params) => {
			type _CheckParams = DCommon.ExpectType<keyof typeof params, "accumulator" | "count" | "next" | "exit", "strict">;

			expect(params).not.toHaveProperty("previousOutput");

			return params.count === 0
				? params.next(params.accumulator + 1, 1)
				: params.exit(params.accumulator + 1);
		});

		expect(DArray.from(result)).toStrictEqual([1, 2]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number, unknown, unknown>, "strict">;
	});

	it("restricts explicitly declared next and exit output types", () => {
		const result = DGenerator.loopAccumulator(
			0,
			(params: DGenerator.LoopAccumulatorParams<number, number>) => {
				// @ts-expect-error next must use the declared output type
				params.next(params.accumulator, "invalid");
				// @ts-expect-error exit must use the next output type
				params.exit("invalid");
				// @ts-expect-error every exit output must use the next output type
				params.exit(2, "invalid");
				// @ts-expect-error a promise is not a numeric output
				params.exit(Promise.resolve(2));
				// @ts-expect-error an object is not a numeric output
				params.exit({ value: 2 });

				params.exit();
				params.exit(undefined);

				return params.count === 0
					? params.next(params.accumulator + 1, 1)
					: params.exit(2, undefined, 3);
			},
		);

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<1 | 2 | 3, unknown, unknown>, "strict">;
	});

	it("yields next and exit values while carrying an independent accumulator", () => {
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(0, (params) => {
			observer(params);
			if (params.accumulator === 6) {
				const result = params.exit("done");

				expect(result).toStrictEqual({ "-exitData": ["done"] });

				type _CheckExitResult = DCommon.ExpectType<
					typeof result,
					DGenerator.LoopAccumulatorOutputExistResult<"done">,
					"strict"
				>;

				return result;
			}

			return params.next(params.accumulator + 2, params.accumulator * 10);
		});

		expect(observer).not.toHaveBeenCalled();
		expect(DArray.from(result)).toStrictEqual([0, 20, 40, "done"]);
		expect(observer).toHaveBeenCalledTimes(4);
		expect(observer).toHaveBeenNthCalledWith(1, expect.objectContaining({
			count: 0,
			accumulator: 0,
		}));
		expect(observer).toHaveBeenNthCalledWith(4, expect.objectContaining({
			count: 3,
			accumulator: 6,
		}));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<number | "done", unknown, unknown>,
			"strict"
		>;
	});

	it("updates the accumulator even when next yields undefined", () => {
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(10, (params) => {
			observer(params);
			if (params.count === 3) {
				return params.exit();
			}

			return params.next(
				params.accumulator + 1,
				params.count === 1 ? undefined : params.accumulator,
			);
		});

		expect(DArray.from(result)).toStrictEqual([10, 12]);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			count: 1,
			accumulator: 11,
		}));
		expect(observer).toHaveBeenNthCalledWith(3, expect.objectContaining({
			count: 2,
			accumulator: 12,
		}));
		expect(observer).toHaveBeenCalledTimes(4);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number, unknown, unknown>, "strict">;
	});

	it.each([
		{
			output: undefined,
			expected: [],
		},
		{
			output: 0,
			expected: [0],
		},
		{
			output: false,
			expected: [false],
		},
		{
			output: "",
			expected: [""],
		},
		{
			output: null,
			expected: [null],
		},
	])("exits immediately with $output", ({ output, expected }) => {
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(0, (params) => {
			observer(params);
			return params.exit(output);
		});

		expect(DArray.from(result)).toStrictEqual(expected);
		expect(observer).toHaveBeenCalledTimes(1);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number | boolean | string | null, unknown, unknown>, "strict">;
	});

	it("yields batches in order and supports turns without outputs", () => {
		const values = [2, "tail"] as const;
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(0, (params) => {
			observer(params);
			if (params.count === 3) {
				return params.exit(undefined, "done", "end", undefined);
			}
			if (params.count === 2) {
				return params.next(params.accumulator + 1, 7, undefined);
			}
			if (params.count === 1) {
				return params.next(params.accumulator + 1);
			}

			const result = params.next(params.accumulator + 1, 0, false, "", null, ...values);

			expect(result).toStrictEqual({
				accumulator: 1,
				"-nextData": [0, false, "", null, 2, "tail"],
			});

			type _CheckNextResult = DCommon.ExpectType<
				typeof result,
				DGenerator.LoopAccumulatorOutputNextResult<number, 0 | false | "" | null | 2 | "tail">,
				"strict"
			>;

			return result;
		});

		expect(DArray.from(result)).toStrictEqual([0, false, "", null, 2, "tail", 7, "done", "end"]);
		expect(observer).toHaveBeenCalledTimes(4);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			accumulator: 1,
		}));
		expect(observer).toHaveBeenNthCalledWith(3, expect.objectContaining({
			accumulator: 2,
		}));
		expect(observer).toHaveBeenNthCalledWith(4, expect.objectContaining({
			accumulator: 3,
		}));

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<0 | false | "" | null | 2 | "tail" | 7 | "done" | "end", unknown, unknown>, "strict">;
	});

	it("supports an object accumulator and rejects incompatible updates", () => {
		const initialAccumulator = { total: 0 };
		const from = DGenerator.loopAccumulatorFrom(initialAccumulator);
		const result = DGenerator.loopAccumulator(from, (params) => {
			const { accumulator, count, next, exit } = params;
			type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, { total: number }, "strict">;

			// @ts-expect-error the accumulator must retain its initial type
			next({ total: "invalid" });

			return count === 2
				? exit()
				: next({ total: accumulator.total + 1 });
		});

		expect(DArray.from(result)).toStrictEqual([]);
		expect(initialAccumulator).toStrictEqual({ total: 0 });

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<never, unknown, unknown>, "strict">;
	});

	it("uses an explicitly typed object with an optional field", () => {
		interface Accumulator {
			total: number;
			previous?: number;
		}
		const from = DGenerator.loopAccumulatorFrom<Accumulator>({ total: 0 });
		const result = DGenerator.loopAccumulator(
			from,
			({ accumulator, count, next, exit }) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, Accumulator, "strict">;

				return count === 3
					? exit(accumulator)
					: next({
						total: accumulator.total + 1,
						previous: accumulator.total,
					});
			},
		);

		expect(DArray.from(result)).toStrictEqual([
			{
				total: 3,
				previous: 2,
			},
		]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<Accumulator, unknown, unknown>, "strict">;
	});

	it("uses an explicitly typed empty array", () => {
		const from = DGenerator.loopAccumulatorFrom<readonly number[]>([]);
		const result = DGenerator.loopAccumulator(
			from,
			({ accumulator, count, next, exit }) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, readonly number[], "strict">;

				return count === 3
					? exit(accumulator)
					: next(DArray.push(accumulator, count));
			},
		);

		expect(DArray.from(result)).toStrictEqual([[0, 1, 2]]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<readonly number[], unknown, unknown>, "strict">;
	});

	it("accepts undefined as an accumulator value", () => {
		const observer = vi.fn();
		const result = DGenerator.loopAccumulator(
			DGenerator.loopAccumulatorFrom<number | undefined>(0),
			(params) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof params.accumulator, number | undefined, "strict">;

				observer(params);
				return params.count === 0
					? params.next(undefined, 1)
					: params.exit();
			},
		);

		expect(DArray.from(result)).toStrictEqual([1]);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({ accumulator: undefined }));

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<1, unknown, unknown>, "strict">;
	});
});

describe("loopAccumulatorFrom", () => {
	it("wraps the value without modifying it and preserves its type", () => {
		const initialAccumulator = { total: 0 };
		const result = DGenerator.loopAccumulatorFrom(initialAccumulator);

		expect(DGenerator.loopAccumulatorKind.getValue(result)).toBe(initialAccumulator);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DGenerator.LoopAccumulatorFromResult<{ total: number }>,
			"strict"
		>;
	});
});
