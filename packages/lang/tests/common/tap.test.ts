import * as DCommon from "@scripts/common";

describe("tap", () => {
	it("executes the action once and returns the same input", () => {
		const input = { value: "input" } as const;
		const action = vi.fn(() => "ignored");

		const result = DCommon.tap(input, action);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input, "strict">;

		expect(result).toBe(input);
		expect(action).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("infers the callback input and preserves the value in a pipe", () => {
		const input = { value: "input" } as const;
		const action = vi.fn();

		const result = DCommon.pipe(
			input,
			DCommon.tap((value) => {
				type _CheckInput = DCommon.ExpectType<typeof value, typeof input, "strict">;

				action(value);
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input, "strict">;

		expect(result).toBe(input);
		expect(action).toHaveBeenCalledExactlyOnceWith(input);
	});

	it.each([
		{
			input: undefined,
			expected: undefined,
		},
		{
			input: null,
			expected: null,
		},
		{
			input: false,
			expected: false,
		},
		{
			input: 0,
			expected: 0,
		},
		{
			input: "",
			expected: "",
		},
	])("preserves the value $input", ({ input, expected }) => {
		const action = vi.fn();

		const result = DCommon.tap(input, action);

		expect(result).toBe(expected);
		expect(action).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("passes function inputs to the action without executing them", () => {
		const input = vi.fn();
		const action = vi.fn(() => undefined);

		const result = DCommon.tap(input, action);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input, "strict">;

		expect(result).toBe(input);
		expect(input).not.toHaveBeenCalled();
		expect(action).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("waits for an asynchronous action before returning the input", async() => {
		const input = { value: "input" } as const;
		const pendingAction = DCommon.createExternalPromise<string>();
		const action = vi.fn(() => pendingAction.promise);
		const nextStep = vi.fn();

		const result = DCommon.tap(input, action);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof input>, "strict">;

		const continuation = DCommon.callThen(result, nextStep);

		await Promise.resolve();
		expect(nextStep).not.toHaveBeenCalled();
		expect(action).toHaveBeenCalledExactlyOnceWith(input);

		pendingAction.resolve("ignored");

		await expect(result).resolves.toBe(input);
		await continuation;
		expect(nextStep).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("preserves asynchronous result types in a pipe", async() => {
		const input = { value: "input" } as const;
		const action = vi.fn((_value: typeof input) => Promise.resolve("ignored"));

		const result = DCommon.pipe(
			input,
			DCommon.tap((value) => {
				type _CheckInput = DCommon.ExpectType<typeof value, typeof input, "strict">;

				return action(value);
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<typeof input>, "strict">;

		await expect(result).resolves.toBe(input);
		expect(action).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("propagates synchronous action errors", () => {
		const error = new Error("action failed");
		const action = vi.fn(() => {
			throw error;
		});

		expect(() => DCommon.tap("input", action)).toThrow(error);
		expect(action).toHaveBeenCalledExactlyOnceWith("input");
	});

	it("propagates asynchronous action rejections", async() => {
		const error = new Error("action failed");
		const action = vi.fn(() => Promise.reject(error));

		const result = DCommon.pipe("input", DCommon.tap(action));

		await expect(result).rejects.toBe(error);
		expect(action).toHaveBeenCalledExactlyOnceWith("input");
	});
});
