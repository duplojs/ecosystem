import { pipe, type ExpectType, DChrono } from "@scripts";

describe("betweenThan", () => {
	const lower = DChrono.createDate("2024-01-01");
	const upper = DChrono.createDate("2024-01-10");

	it("returns true when input is strictly inside range", () => {
		const result = DChrono.betweenThanDate(
			DChrono.createDate("2024-01-05"),
			lower,
			upper,
		);

		expect(result).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns false when input equals range bounds", () => {
		expect(DChrono.betweenThanDate(lower, lower, upper)).toBe(false);
		expect(DChrono.betweenThanDate(upper, lower, upper)).toBe(false);
	});

	it("returns false when input is outside range", () => {
		const result = DChrono.betweenThanDate(
			DChrono.createDate("2024-01-12"),
			lower,
			upper,
		);

		expect(result).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2024-01-06"),
			DChrono.betweenThanDate(lower, upper),
		);

		expect(result).toBe(true);
	});
});
