import { DEither, pipe, type ExpectType } from "@scripts";

describe("asyncSafeCallback", () => {
	it("should wrap callback output into a success either", async() => {
		const result = DEither.asyncSafeCallback(() => 42);

		await expect(result).resolves.toStrictEqual(DEither.right("safe-callback-success", 42));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<DEither.SafeCallbackSuccess<42> | DEither.SafeCallbackError>,
			"strict"
		>;
	});

	it("should wrap promise values and preserve either values", async() => {
		const done = "done";
		const fromPromise = DEither.asyncSafeCallback(Promise.resolve(done));
		const either = DEither.error("message");
		const preserved = DEither.asyncSafeCallback(() => Promise.resolve(either));

		await expect(fromPromise).resolves.toStrictEqual(DEither.right("safe-callback-success", "done"));
		await expect(preserved).resolves.toBe(either);

		type _CheckFromPromise = ExpectType<
			typeof fromPromise,
			Promise<DEither.SafeCallbackSuccess<string> | DEither.SafeCallbackError>,
			"strict"
		>;
		type _CheckPreserved = ExpectType<
			typeof preserved,
			Promise<DEither.Error<"message"> | DEither.SafeCallbackError>,
			"strict"
		>;
	});

	it("should return callback errors for thrown or rejected values", async() => {
		const caught = new Error("boom");
		const thrown = DEither.asyncSafeCallback(() => {
			throw caught;
		});
		const rejected = DEither.asyncSafeCallback(Promise.reject(caught));

		await expect(thrown).resolves.toStrictEqual(DEither.left("safe-callback-error", caught));
		await expect(rejected).resolves.toStrictEqual(DEither.left("safe-callback-error", caught));
	});

	it("should work in pipe", async() => {
		const result = pipe(
			() => 42,
			DEither.asyncSafeCallback,
		);

		await expect(result).resolves.toStrictEqual(DEither.right("safe-callback-success", 42));
	});
});
