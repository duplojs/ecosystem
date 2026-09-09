import { pipe, type ExpectType, DChrono } from "@scripts";

describe("between", () => {
	const lower = DChrono.createDate("2024-01-01");
	const upper = DChrono.createDate("2024-01-10");

	it("returns true when input is within inclusive range", () => {
		const result = DChrono.betweenThanOrEqualDate(
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

	it("returns true when input equals bounds", () => {
		expect(DChrono.betweenThanOrEqualDate(lower, lower, upper)).toBe(true);
		expect(DChrono.betweenThanOrEqualDate(upper, lower, upper)).toBe(true);
	});

	it("returns false when input is outside range", () => {
		const result = DChrono.betweenThanOrEqualDate(
			DChrono.createDate("2024-01-15"),
			lower,
			upper,
		);

		expect(result).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2024-01-03"),
			DChrono.betweenThanOrEqualDate(lower, upper),
		);

		expect(result).toBe(true);
	});
});
