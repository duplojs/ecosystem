import { pipe, type ExpectType, DChrono } from "@scripts";

describe("lessThan", () => {
	const threshold = DChrono.createDate("2024-01-05");

	it("returns true when input is strictly less than threshold", () => {
		const result = DChrono.lessThanDate(
			DChrono.createDate("2024-01-01"),
			threshold,
		);

		expect(result).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns false when input equals threshold", () => {
		expect(DChrono.lessThanDate(threshold, threshold)).toBe(false);
	});

	it("returns false when input is greater than threshold", () => {
		expect(DChrono.lessThanDate(DChrono.createDate("2024-01-10"), threshold)).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2024-01-02"),
			DChrono.lessThanDate(threshold),
		);

		expect(result).toBe(true);
	});
});
