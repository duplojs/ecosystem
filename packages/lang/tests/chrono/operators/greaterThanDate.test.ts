import { pipe, type ExpectType, DChrono } from "@scripts";

describe("greaterThan", () => {
	const threshold = DChrono.createDate("2024-01-05");

	it("returns true when input is strictly greater than threshold", () => {
		const result = DChrono.greaterThanDate(
			DChrono.createDate("2024-01-06"),
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
		expect(DChrono.greaterThanDate(threshold, threshold)).toBe(false);
	});

	it("returns false when input is less", () => {
		expect(DChrono.greaterThanDate(DChrono.createDate("2024-01-01"), threshold)).toBe(false);
	});

	it("une in pipe", () => {
		const result = pipe(
			DChrono.createDate("2024-01-10"),
			DChrono.greaterThanDate(threshold),
		);

		expect(result).toBe(true);
	});
});
