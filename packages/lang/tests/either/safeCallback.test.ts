import { DEither, pipe, type ExpectType } from "@scripts";

describe("safeCallback", () => {
	it("should wrap callback output into a success either", () => {
		const result = DEither.safeCallback(() => 42);

		expect(result).toStrictEqual(DEither.right("safe-callback-success", 42));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.SafeCallbackSuccess<42> | DEither.SafeCallbackError,
			"strict"
		>;
	});

	it("should return callback errors when the callback throws", () => {
		const caught = new Error("boom");
		const result = DEither.safeCallback(() => {
			throw caught;
		});

		expect(result).toStrictEqual(DEither.left("safe-callback-error", caught));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.SafeCallbackError,
			"strict"
		>;
	});

	it("should preserve either outputs", () => {
		const either = DEither.error("message");
		const result = DEither.safeCallback(() => either);

		expect(result).toBe(either);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Error<"message"> | DEither.SafeCallbackError,
			"strict"
		>;
	});

	it("should wrap promise outputs and rejected promises", async() => {
		const done = "done";
		const success = DEither.safeCallback(() => Promise.resolve(done));
		const failure = DEither.safeCallback(() => Promise.reject(new Error("boom")));

		await expect(success).resolves.toStrictEqual(DEither.right("safe-callback-success", "done"));
		await expect(failure).resolves.toEqual(DEither.left("safe-callback-error", expect.any(Error)));

		type _CheckSuccess = ExpectType<
			typeof success,
			| Promise<DEither.SafeCallbackSuccess<string> | DEither.SafeCallbackError>
			| DEither.SafeCallbackError,
			"strict"
		>;
	});

	it("should preserve promised either outputs in pipe", async() => {
		const result = pipe(
			() => Promise.resolve(DEither.success(42)),
			DEither.safeCallback,
		);

		await expect(result).resolves.toStrictEqual(DEither.success(42));

		type _CheckResult = ExpectType<
			typeof result,
			| Promise<DEither.Success<42> | DEither.SafeCallbackError>
			| DEither.SafeCallbackError,
			"strict"
		>;
	});
});
