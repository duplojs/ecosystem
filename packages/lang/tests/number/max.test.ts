import { type DArray, DNumber, pipe, type ExpectType } from "@scripts";

describe("max", () => {
	it("should return the greatest number", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<2>;
		const result = DNumber.max(source);

		expect(result).toBe(3);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should return the greatest number inside a pipe", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<1>;
		const result = pipe(
			source,
			DNumber.max,
			(value) => value * 2,
		);

		expect(result).toBe(6);
	});

	it("should reject an empty array", () => {
		if (false) {
			// @ts-expect-error max expects at least one number.
			DNumber.max([]);
		}
	});
});
