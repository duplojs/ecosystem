import { DCommon, type ExpectType } from "@scripts";

describe("callThen", () => {
	it("calls the callback directly for non-promise inputs", () => {
		const result = DCommon.callThen(
			"test" as const,
			(input) => input.length,
		);

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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
});
