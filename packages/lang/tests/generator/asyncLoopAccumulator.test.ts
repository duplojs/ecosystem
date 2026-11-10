import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DGenerator from "@scripts/generator";

describe("asyncLoopAccumulator", () => {
	it("infers the accumulator and mixed outputs lazily", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(
			0,
			(params) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof params.accumulator, number, "strict">;

				observer(params);

				return params.count === 0
					? params.next(params.accumulator + 1, Promise.resolve(params.accumulator), "value", Promise.resolve(undefined))
					: params.exit(Promise.resolve(params.accumulator));
			},
		);

		expect(observer).not.toHaveBeenCalled();
		expect(await DArray.from(result)).toStrictEqual([0, "value", 1]);
		expect(observer).toHaveBeenCalledTimes(2);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			count: 1,
			accumulator: 1,
		}));

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number | "value", unknown, unknown>, "strict">;
	});

	it("infers never without outputs", async() => {
		const result = DGenerator.asyncLoopAccumulator(
			0,
			({ accumulator, count, next, exit }) => (
				Promise.resolve(count === 0 ? next(accumulator + 1) : exit())
			),
		);

		expect(await DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("preserves a wrapped accumulator type", async() => {
		interface Accumulator {
			total: number;
			previous?: number;
		}

		const initialAccumulator: Accumulator = { total: 0 };
		const result = DGenerator.asyncLoopAccumulator(
			DGenerator.loopAccumulatorFrom(initialAccumulator),
			({ accumulator, count, next, exit }) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, Accumulator, "strict">;

				// @ts-expect-error the accumulator must retain its initial type
				next({ total: "invalid" });

				return count === 2
					? exit(Promise.resolve(accumulator))
					: next({
						total: accumulator.total + 1,
						previous: accumulator.total,
					});
			},
		);

		expect(await DArray.from(result)).toStrictEqual([
			{
				total: 2,
				previous: 1,
			},
		]);
		expect(initialAccumulator).toStrictEqual({ total: 0 });

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<Accumulator, unknown, unknown>, "strict">;
	});

	it("restricts declared output types", async() => {
		const result = DGenerator.asyncLoopAccumulator(
			0,
			(params: DGenerator.AsyncLoopAccumulatorParams<number, number>) => {
				// @ts-expect-error next must use the declared output type
				params.next(params.accumulator, "invalid");
				// @ts-expect-error exit must use the declared output type
				params.exit("invalid");

				return params.count === 0
					? params.next(params.accumulator + 1, Promise.resolve(1))
					: params.exit(2, undefined, 3);
			},
		);

		expect(await DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("infers never when no outputs are emitted", async() => {
		const result = DGenerator.asyncLoopAccumulator(0, ({ accumulator, count, next, exit }) => (
			Promise.resolve(count === 0 ? next(accumulator + 1) : exit())
		));

		await expect(DArray.from(result)).resolves.toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("infers resolved mixed outputs without explicit types", async() => {
		const result = DGenerator.asyncLoopAccumulator(0, ({ accumulator, count, next, exit }) => count === 0
			? next(accumulator + 1, Promise.resolve(accumulator), "value", Promise.resolve(undefined))
			: exit(Promise.resolve(accumulator)));

		await expect(DArray.from(result)).resolves.toStrictEqual([0, "value", 1]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number | "value", unknown, unknown>, "strict">;
	});

	it("does not emit promised undefined exit values", async() => {
		const result = DGenerator.asyncLoopAccumulator(0, ({ exit }) => exit(Promise.resolve(undefined)));

		await expect(result.next()).resolves.toStrictEqual({
			done: true,
			value: undefined,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("resolves next and exit batches in order", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, (params) => {
			observer(params);

			if (params.count === 0) {
				return params.next(1, Promise.resolve(1), Promise.resolve(undefined), 2, Promise.resolve(undefined));
			}
			if (params.count === 1) {
				return params.next(2, Promise.resolve(3));
			}

			return params.exit(Promise.resolve(4), Promise.resolve(undefined), 5);
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3, 4, 5]);
		expect(observer).toHaveBeenCalledTimes(3);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({ count: 1 }));
		expect(observer).toHaveBeenNthCalledWith(3, expect.objectContaining({ count: 2 }));

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("does not expose previousOutput in callback parameters", async() => {
		const result = DGenerator.asyncLoopAccumulator(0, (params) => {
			type _CheckParams = DCommon.ExpectType<keyof typeof params, "accumulator" | "count" | "next" | "exit", "strict">;

			expect(params).not.toHaveProperty("previousOutput");

			return params.count === 0
				? params.next(params.accumulator + 1, Promise.resolve(1))
				: params.exit(Promise.resolve(params.accumulator + 1));
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("propagates rejected next outputs", async() => {
		const error = new Error("output failed");
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, (params) => {
			observer(params);
			return params.next(1, Promise.reject(error));
		});

		await expect(DArray.from(result)).rejects.toBe(error);
		expect(observer).toHaveBeenCalledTimes(1);
	});

	it("propagates rejected exit outputs", async() => {
		const error = new Error("output failed");
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, (params) => {
			observer(params);
			return params.exit(Promise.reject(error));
		});

		await expect(DArray.from(result)).rejects.toBe(error);
		expect(observer).toHaveBeenCalledTimes(1);
	});

	it("restricts explicitly declared next and exit output types", async() => {
		const result = DGenerator.asyncLoopAccumulator(
			0,
			(params: DGenerator.AsyncLoopAccumulatorParams<number, number>) => {
				// @ts-expect-error next must use the declared output type
				params.next(params.accumulator, "invalid");
				// @ts-expect-error exit must use the next output type
				params.exit("invalid");
				// @ts-expect-error every exit output must use the next output type
				params.exit(2, "invalid");
				// @ts-expect-error resolved exit values must match the output type
				params.exit(Promise.resolve("invalid"));
				// @ts-expect-error an object is not a numeric output
				params.exit({ value: 2 });

				params.exit();
				params.exit(undefined);

				return params.count === 0
					? params.next(params.accumulator + 1, Promise.resolve(1))
					: params.exit(2, undefined, 3);
			},
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("awaits next and exit values while carrying an independent accumulator", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, async(params) => {
			observer(params);
			await Promise.resolve();
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
		await expect(DArray.from(result)).resolves.toStrictEqual([0, 20, 40, "done"]);
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
			AsyncGenerator<number | "done", unknown, unknown>,
			"strict"
		>;
	});

	it("updates the accumulator even when next yields undefined", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(10, async(params) => {
			observer(params);
			await Promise.resolve();
			if (params.count === 3) {
				return params.exit();
			}

			return params.next(
				params.accumulator + 1,
				params.count === 1 ? undefined : params.accumulator,
			);
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([10, 12]);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			count: 1,
			accumulator: 11,
		}));
		expect(observer).toHaveBeenNthCalledWith(3, expect.objectContaining({
			count: 2,
			accumulator: 12,
		}));
		expect(observer).toHaveBeenCalledTimes(4);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
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
	])("exits immediately with $output using a synchronous observer", async({ output, expected }) => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, (params) => {
			observer(params);
			return params.exit(output);
		});

		await expect(DArray.from(result)).resolves.toStrictEqual(expected);
		expect(observer).toHaveBeenCalledTimes(1);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number | boolean | string | null, unknown, unknown>, "strict">;
	});

	it("yields batches in order and supports turns without outputs", async() => {
		const values = [2, "tail"] as const;
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(0, async(params) => {
			observer(params);
			await Promise.resolve();
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

		await expect(DArray.from(result)).resolves.toStrictEqual([0, false, "", null, 2, "tail", 7, "done", "end"]);
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<0 | false | "" | null | 2 | "tail" | 7 | "done" | "end", unknown, unknown>,
			"strict"
		>;
	});

	it("supports an object accumulator and rejects incompatible updates", async() => {
		const initialAccumulator = { total: 0 };
		const from = DGenerator.loopAccumulatorFrom(initialAccumulator);
		const result = DGenerator.asyncLoopAccumulator(from, (params) => {
			const { accumulator, count, next, exit } = params;
			type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, { total: number }, "strict">;

			// @ts-expect-error the accumulator must retain its initial type
			next({ total: "invalid" });

			return count === 2
				? exit()
				: next({ total: accumulator.total + 1 });
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([]);
		expect(initialAccumulator).toStrictEqual({ total: 0 });

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("uses an explicitly typed object with an optional field", async() => {
		interface Accumulator {
			total: number;
			previous?: number;
		}
		const from = DGenerator.loopAccumulatorFrom<Accumulator>({ total: 0 });
		const result = DGenerator.asyncLoopAccumulator(from, ({ accumulator, count, next, exit }) => {
			type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, Accumulator, "strict">;

			return Promise.resolve(count === 3
				? exit(accumulator)
				: next({
					total: accumulator.total + 1,
					previous: accumulator.total,
				}));
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([
			{
				total: 3,
				previous: 2,
			},
		]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<Accumulator, unknown, unknown>, "strict">;
	});

	it("uses an explicitly typed empty array", async() => {
		const from = DGenerator.loopAccumulatorFrom<readonly number[]>([]);
		const result = DGenerator.asyncLoopAccumulator(from, ({ accumulator, count, next, exit }) => {
			type _CheckAccumulator = DCommon.ExpectType<typeof accumulator, readonly number[], "strict">;

			return count === 3
				? exit(accumulator)
				: next(DArray.push(accumulator, count));
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([[0, 1, 2]]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<readonly number[], unknown, unknown>, "strict">;
	});

	it("accepts undefined as an accumulator value", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoopAccumulator(
			DGenerator.loopAccumulatorFrom<number | undefined>(0),
			(params) => {
				type _CheckAccumulator = DCommon.ExpectType<typeof params.accumulator, number | undefined, "strict">;

				observer(params);
				return params.count === 0
					? params.next(undefined, 1)
					: params.exit();
			},
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1]);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({ accumulator: undefined }));

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<1, unknown, unknown>, "strict">;
	});

	it("propagates callback rejections", async() => {
		const error = new Error("loop failed");
		const callback = vi.fn(() => Promise.reject(error));
		const result = DGenerator.asyncLoopAccumulator(0, callback);

		await expect(DArray.from(result)).rejects.toBe(error);
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
