import { type DArray, DNumber, pipe, type ExpectType } from "@scripts";

describe("maxOf", () => {
	it("should return the greatest number", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<1>;
		const result = DNumber.maxOf(source);

		expect(result).toBe(3);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should update the result when a greater number is found", () => {
		const source = [1, 3, 2] as number[] & DArray.MinElements<1>;

		expect(DNumber.maxOf(source)).toBe(3);
	});

	it("should return the greatest number inside a pipe", () => {
		const source = [3, -1, 2] as number[] & DArray.MinElements<1>;
		const result = pipe(
			source,
			DNumber.maxOf,
			(value) => value * 2,
		);

		expect(result).toBe(6);
	});

	it("should reject an empty array", () => {
		if (false) {
			// @ts-expect-error maxOf expects at least one number.
			DNumber.maxOf([]);
		}
	});
});
