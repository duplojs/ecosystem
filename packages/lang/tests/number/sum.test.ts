import { DNumber, pipe, type ExpectType } from "@scripts";

describe("sum", () => {
	it("should return the sum of numbers", () => {
		const result = DNumber.sum([3, -1, 2]);

		expect(result).toBe(4);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should return zero for an empty array", () => {
		expect(DNumber.sum([])).toBe(0);
	});

	it("should return the sum inside a pipe", () => {
		const result = pipe(
			[3, -1, 2],
			DNumber.sum,
			(value) => value * 2,
		);

		expect(result).toBe(8);
	});
});
