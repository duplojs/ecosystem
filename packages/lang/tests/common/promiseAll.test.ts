import { DCommon, type ExpectType } from "@scripts";

describe("promiseAll", () => {
	it("awaits tuple values while preserving tuple output", async() => {
		const result = DCommon.promiseAll([
			Promise.resolve(1 as const),
			"value" as const,
		] as const);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<[1, "value"]>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual([1, "value"]);
	});

	it("awaits iterable values as an array", async() => {
		const result = DCommon.promiseAll(
			new Set([
				Promise.resolve(1),
				Promise.resolve(2),
			]),
		);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<number[]>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual([1, 2]);
	});
});
