import { type DArray, DNumber, pipe, type ExpectType } from "@scripts";

describe("min", () => {
	it("should return the smallest number", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<1>;
		const result = DNumber.min(source);

		expect(result).toBe(-1);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should return the smallest number inside a pipe", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<1>;
		const result = pipe(
			source,
			DNumber.min,
			(value) => value * 2,
		);

		expect(result).toBe(-2);
	});

	it("should reject an empty array", () => {
		if (false) {
			// @ts-expect-error min expects at least one number.
			DNumber.min([]);
		}
	});
});
