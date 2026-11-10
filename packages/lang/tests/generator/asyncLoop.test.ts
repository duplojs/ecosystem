import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DGenerator from "@scripts/generator";

describe("asyncLoop", () => {
	it("infers never when no outputs are emitted", async() => {
		const result = DGenerator.asyncLoop(({ count, next, exit }) => (
			Promise.resolve(count === 0 ? next() : exit())
		));

		await expect(DArray.from(result)).resolves.toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("infers resolved mixed outputs without explicit types", async() => {
		const result = DGenerator.asyncLoop(({ count, next, exit }) => count === 0
			? next(Promise.resolve(count), "value", Promise.resolve(undefined))
			: exit(Promise.resolve(count)));

		await expect(DArray.from(result)).resolves.toStrictEqual([0, "value", 1]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number | "value", unknown, unknown>, "strict">;
	});

	it("does not emit promised undefined exit values", async() => {
		const result = DGenerator.asyncLoop(({ exit }) => exit(Promise.resolve(undefined)));

		await expect(result.next()).resolves.toStrictEqual({
			done: true,
			value: undefined,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<never, unknown, unknown>, "strict">;
	});

	it("resolves next and exit batches in order", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoop((params) => {
			observer(params);

			if (params.count === 0) {
				return params.next(Promise.resolve(1), Promise.resolve(undefined), 2, Promise.resolve(undefined));
			}
			if (params.count === 1) {
				return params.next(Promise.resolve(3));
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
		const result = DGenerator.asyncLoop((params) => {
			type _CheckParams = DCommon.ExpectType<keyof typeof params, "count" | "next" | "exit", "strict">;

			expect(params).not.toHaveProperty("previousOutput");

			return params.count === 0
				? params.next(Promise.resolve(1))
				: params.exit(Promise.resolve(params.count + 1));
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("propagates rejected next outputs", async() => {
		const error = new Error("output failed");
		const observer = vi.fn();
		const result = DGenerator.asyncLoop((params) => {
			observer(params);
			return params.next(Promise.reject(error));
		});

		await expect(DArray.from(result)).rejects.toBe(error);
		expect(observer).toHaveBeenCalledTimes(1);
	});

	it("propagates rejected exit outputs", async() => {
		const error = new Error("output failed");
		const observer = vi.fn();
		const result = DGenerator.asyncLoop((params) => {
			observer(params);
			return params.exit(Promise.reject(error));
		});

		await expect(DArray.from(result)).rejects.toBe(error);
		expect(observer).toHaveBeenCalledTimes(1);
	});

	it("restricts explicitly declared next and exit output types", async() => {
		const result = DGenerator.asyncLoop((params: DGenerator.AsyncLoopParams<number>) => {
			// @ts-expect-error next must use the declared output type
			params.next("invalid");
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
				? params.next(Promise.resolve(1))
				: params.exit(2, undefined, 3);
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<number, unknown, unknown>, "strict">;
	});

	it("yields next values and final exit value", async() => {
		const result = DGenerator.asyncLoop(
			(params) => Promise.resolve(
				params.count === 3
					? params.exit("done")
					: params.next(params.count + 1),
			),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3, "done"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<number | "done", unknown, unknown>,
			"strict"
		>;
	});

	it("skips undefined next and exit values", async() => {
		const result = DGenerator.asyncLoop(
			(params) => {
				if (params.count === 5) {
					return Promise.resolve(params.exit());
				}

				if (params.count % 2 === 0) {
					return Promise.resolve(params.next(params.count));
				}

				return Promise.resolve(params.next());
			},
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([0, 2, 4]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("yields batches in order and supports turns without outputs", async() => {
		const values = [2, "tail"] as const;
		const observer = vi.fn();
		const result = DGenerator.asyncLoop(async(params) => {
			observer(params);
			await Promise.resolve();
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
		await expect(DArray.from(result)).resolves.toStrictEqual([0, false, "", null, 2, "tail", 7, "done", "end"]);
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<0 | false | "" | null | 2 | "tail" | 7 | "done" | "end", unknown, unknown>,
			"strict"
		>;
	});

	it("supports a synchronous callback exiting immediately with mixed outputs", async() => {
		const observer = vi.fn();
		const result = DGenerator.asyncLoop((params) => {
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

		await expect(DArray.from(result)).resolves.toStrictEqual(["done", 1, false, "", null]);
		expect(observer).toHaveBeenCalledTimes(1);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<"done" | 1 | false | "" | null, unknown, unknown>,
			"strict"
		>;
	});

	it("emits an array as a single value", async() => {
		const value = [1, 2] as const;
		const result = DGenerator.asyncLoop((params) => params.exit(value));

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, 2]]);

		type _CheckResult = DCommon.ExpectType<typeof result, AsyncGenerator<readonly [1, 2], unknown, unknown>, "strict">;
	});
});
