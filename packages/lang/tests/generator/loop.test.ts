import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DGenerator from "@scripts/generator";

describe("loop", () => {
	it("infers never when no outputs are emitted", () => {
		const result = DGenerator.loop(({ count, next, exit }) => (
			count === 0 ? next() : exit()
		));

		expect(DArray.from(result)).toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<never, unknown, unknown>, "strict">;
	});

	it("infers mixed outputs without explicit types", () => {
		const result = DGenerator.loop(({ count, next, exit }) => count === 0
			? next(count, "value", undefined)
			: exit(count));

		expect(DArray.from(result)).toStrictEqual([0, "value", 1]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number | "value", unknown, unknown>, "strict">;
	});

	it("preserves promised outputs in a synchronous generator", () => {
		const output = Promise.resolve(undefined);
		const result = DGenerator.loop(({ exit }) => exit(output));

		expect(DArray.from(result)).toStrictEqual([output]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<Promise<undefined>, unknown, unknown>, "strict">;
	});

	it("does not expose previousOutput in callback parameters", () => {
		const result = DGenerator.loop((params) => {
			type _CheckParams = DCommon.ExpectType<keyof typeof params, "count" | "next" | "exit", "strict">;

			expect(params).not.toHaveProperty("previousOutput");

			return params.count === 0
				? params.next(1)
				: params.exit(params.count + 1);
		});

		expect(DArray.from(result)).toStrictEqual([1, 2]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<number, unknown, unknown>, "strict">;
	});

	it("restricts explicitly declared next and exit output types", () => {
		const result = DGenerator.loop((params: DGenerator.LoopParams<number>) => {
			// @ts-expect-error next must use the declared output type
			params.next("invalid");
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
				? params.next(1)
				: params.exit(2, undefined, 3);
		});

		expect(DArray.from(result)).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<1 | 2 | 3, unknown, unknown>, "strict">;
	});

	it("yields next values and final exit value", () => {
		const result = DGenerator.loop((params) => params.count === 3
			? params.exit(4)
			: params.next(params.count + 1));

		expect(DArray.from(result)).toStrictEqual([1, 2, 3, 4]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("skips undefined next and exit values", () => {
		const result = DGenerator.loop((params) => {
			if (params.count === 5) {
				return params.exit();
			}

			return params.count % 2 === 0
				? params.next(params.count)
				: params.next();
		});

		expect(DArray.from(result)).toStrictEqual([0, 2, 4]);
	});

	it("yields batches in order and supports turns without outputs", () => {
		const values = [2, "tail"] as const;
		const observer = vi.fn();
		const result = DGenerator.loop((params) => {
			observer(params);
			if (params.count === 3) {
				return params.exit(undefined, "done", "end", undefined);
			}
			if (params.count === 2) {
				return params.next(7, undefined);
			}
			if (params.count === 1) {
				return params.next();
			}

			const result = params.next(0, false, "", null, ...values);

			expect(result).toStrictEqual({ "-nextData": [0, false, "", null, 2, "tail"] });

			type _CheckNextResult = DCommon.ExpectType<
				typeof result,
				DGenerator.LoopOutputNextResult<0 | false | "" | null | 2 | "tail">,
				"strict"
			>;

			return result;
		});

		expect(observer).not.toHaveBeenCalled();
		expect(DArray.from(result)).toStrictEqual([0, false, "", null, 2, "tail", 7, "done", "end"]);
		expect(observer).toHaveBeenCalledTimes(4);
		expect(observer).toHaveBeenNthCalledWith(2, expect.objectContaining({
			count: 1,
		}));
		expect(observer).toHaveBeenNthCalledWith(3, expect.objectContaining({
			count: 2,
		}));
		expect(observer).toHaveBeenNthCalledWith(4, expect.objectContaining({
			count: 3,
		}));

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<0 | false | "" | null | 2 | "tail" | 7 | "done" | "end", unknown, unknown>, "strict">;
	});

	it("supports a synchronous callback exiting immediately with mixed outputs", () => {
		const observer = vi.fn();
		const result = DGenerator.loop((params) => {
			observer(params);
			const result = params.exit("done", 1, undefined, false, "", null);

			expect(result).toStrictEqual({ "-exitData": ["done", 1, undefined, false, "", null] });

			type _CheckExitResult = DCommon.ExpectType<
				typeof result,
				DGenerator.LoopOutputExistResult<"done" | 1 | undefined | false | "" | null>,
				"strict"
			>;

			return result;
		});

		expect(DArray.from(result)).toStrictEqual(["done", 1, false, "", null]);
		expect(observer).toHaveBeenCalledTimes(1);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Generator<"done" | 1 | false | "" | null, unknown, unknown>,
			"strict"
		>;
	});

	it("emits an array as a single value", () => {
		const value = [1, 2] as const;
		const result = DGenerator.loop((params) => params.exit(value));

		expect(DArray.from(result)).toStrictEqual([[1, 2]]);

		type _CheckResult = DCommon.ExpectType<typeof result, Generator<readonly [1, 2], unknown, unknown>, "strict">;
	});
});
