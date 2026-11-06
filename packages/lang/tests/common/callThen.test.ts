
import * as DCommon from "@scripts/common";

describe("callThen", () => {
	it("calls the callback directly for non-promise inputs", () => {
		const result = DCommon.callThen(
			"test" as const,
			(input) => input.length,
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(4);
	});

	it("awaits promise inputs", async() => {
		const result = DCommon.callThen(
			Promise.resolve("test" as const),
			(input) => input.length,
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;

		await expect(result).resolves.toBe(4);
	});

	it("uses the catch callback for synchronous errors", () => {
		const error = new Error("failed");
		const result = DCommon.callThen(
			"value",
			() => {
				throw error;
			},
			(input) => input,
		);

		expect(result).toBe(error);
	});

	it("uses the catch callback for rejected promises", async() => {
		const error = new Error("failed");
		const result = DCommon.callThen(
			Promise.reject(error),
			(input) => input,
			(input) => input,
		);

		await expect(result).resolves.toBe(error);
	});

	it("keeps functions as values when no catch callback is provided", () => {
		const value = vi.fn((input: number) => input + 1);
		const result = DCommon.callThen(value, (input) => {
			type _CheckInput = DCommon.ExpectType<typeof input, typeof value, "strict">;
			return input;
		});

		expect(result).toBe(value);
		expect(value).not.toHaveBeenCalled();
		type _CheckResult = DCommon.ExpectType<typeof result, typeof value, "strict">;
	});

	it("does not execute a zero-argument function without a catch callback", () => {
		const getter = vi.fn(() => 1);
		const result = DCommon.callThen(getter, (input) => input, undefined);

		expect(result).toBe(getter);
		expect(getter).not.toHaveBeenCalled();
		type _CheckResult = DCommon.ExpectType<typeof result, typeof getter, "strict">;
	});

	it("executes a getter once when a catch callback is provided", () => {
		const getter = vi.fn(() => "value" as const);
		const onError = vi.fn(() => "recovered" as const);
		const result = DCommon.callThen(
			getter,
			(input) => {
				type _CheckInput = DCommon.ExpectType<typeof input, "value", "strict">;
				return input.length;
			},
			onError,
		);

		expect(result).toBe(5);
		expect(getter).toHaveBeenCalledExactlyOnceWith();
		expect(onError).not.toHaveBeenCalled();
		type _CheckResult = DCommon.ExpectType<typeof result, number | "recovered", "strict">;
	});

	it("awaits a getter result when a catch callback is provided", async() => {
		const getter = vi.fn(() => Promise.resolve("value" as const));
		const result = DCommon.callThen(
			getter,
			(input) => {
				type _CheckInput = DCommon.ExpectType<typeof input, "value", "strict">;
				return input.length;
			},
			() => "recovered" as const,
		);

		await expect(result).resolves.toBe(5);
		expect(getter).toHaveBeenCalledExactlyOnceWith();
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number | "recovered"> | "recovered",
			"strict"
		>;
	});

	it("catches a synchronous exception from a getter", () => {
		const error = new Error("getter failed");
		const next = vi.fn((input: never) => input);
		const onError = vi.fn(() => "recovered" as const);
		const result = DCommon.callThen(
			() => {
				throw error;
			},
			next,
			onError,
		);

		expect(result).toBe("recovered");
		expect(next).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledExactlyOnceWith(error);
		type _CheckResult = DCommon.ExpectType<typeof result, "recovered", "strict">;
	});

	it("allows synchronous recovery when a getter declared to return a promise throws", () => {
		const error = new Error("failed before returning a promise");
		const result = DCommon.callThen(
			(): Promise<number> => {
				throw error;
			},
			(input) => input + 1,
			() => "recovered" as const,
		);

		expect(result).toBe("recovered");
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number | "recovered"> | "recovered",
			"strict"
		>;
	});

	it("catches a rejection from a getter", async() => {
		const error = new Error("async getter failed");
		const next = vi.fn((input: number) => input + 1);
		const onError = vi.fn(() => "recovered" as const);
		const result = DCommon.callThen(
			(): Promise<number> => Promise.reject(error),
			next,
			onError,
		);

		await expect(result).resolves.toBe("recovered");
		expect(next).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalledExactlyOnceWith(error);
	});

	it("passes functions returned by a getter to the callback", () => {
		const value = vi.fn((input: number) => input + 1);
		const result = DCommon.callThen(
			() => value,
			(input) => {
				type _CheckInput = DCommon.ExpectType<typeof input, typeof value, "strict">;
				return input(1);
			},
			() => 0,
		);

		expect(result).toBe(2);
		expect(value).toHaveBeenCalledExactlyOnceWith(1);
	});

	it("accepts a union of a value and a getter with a catch callback", () => {
		const input = "value" as DCommon.MayBeGetter<"value">;
		const result = DCommon.callThen(input, (value) => value.length, () => 0);

		expect(result).toBe(5);
		type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;
	});

	it("preserves unions of synchronous and asynchronous getter results", () => {
		const getter = (): DCommon.MaybePromise<number> => 1;
		const result = DCommon.callThen(getter, (input) => input + 1, () => "recovered" as const);

		expect(result).toBe(2);
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number | "recovered" | Promise<number | "recovered">,
			"strict"
		>;
	});

	it("does not execute the catch callback again if it throws", () => {
		const error = new Error("getter failed");
		const recoveryError = new Error("recovery failed");
		const onError = vi.fn(() => {
			throw recoveryError;
		});

		expect(() => DCommon.callThen(
			() => {
				throw error;
			},
			(input) => input,
			onError,
		)).toThrow(recoveryError);
		expect(onError).toHaveBeenCalledExactlyOnceWith(error);
	});

	it("rejects functions declaring parameters only when a catch callback is provided", () => {
		// @ts-expect-error getters cannot declare required parameters
		DCommon.callThen((input: number) => input, (input) => input, () => 0);
		// @ts-expect-error getters cannot declare optional parameters
		DCommon.callThen((input?: number) => input, (input) => input, () => 0);
		// @ts-expect-error getters cannot declare default parameters
		DCommon.callThen((input = 1) => input, (input) => input, () => 0);
		// @ts-expect-error getters cannot declare rest parameters
		DCommon.callThen((...input: number[]) => input, (input) => input, () => 0);
		const union = 1 as number | ((input: number) => number);
		// @ts-expect-error unions cannot contain functions declaring parameters
		DCommon.callThen(union, (input) => input, () => 0);
	});
});
