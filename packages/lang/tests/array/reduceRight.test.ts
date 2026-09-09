import { DArray, pipe, type ExpectType } from "@scripts";

describe("reduceRight", () => {
	it("should reduce values from right to left", () => {
		const result = DArray.reduceRight(
			["a", "b", "c"] as const,
			"",
			(params) => params.next(`${params.lastValue}${params.element}`),
		);

		expect(result).toBe("cba");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should reduce values in pipe", () => {
		const result = pipe(
			["a", "b", "c"] as const,
			DArray.reduceRight("", (params) => params.next(`${params.lastValue}${params.element}`)),
		);

		expect(result).toBe("cba");
	});

	it("should exit early", () => {
		const result = DArray.reduceRight(
			[1, 2, 3],
			0,
			(params) => params.element === 2
				? params.exit("stop")
				: params.next(params.lastValue + params.element),
		);

		expect(result).toBe("stop");
	});

	it("should reduce from wrapped value", () => {
		const result = DArray.reduceRight(
			["a", "b"] as const,
			DArray.reduceFrom([] as string[]),
			(params) => params.nextPush(params.lastValue, params.element),
		);

		expect(result).toEqual(["b", "a"]);
	});
});
