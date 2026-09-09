import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getDayOfMonth", () => {
	it("getDayOfMonth returns day of month in UTC", () => {
		const result = DChrono.getDayOfMonth(
			DChrono.createDate("2021-01-15"),
		);

		expect(result).toBe(15);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfMonth returns day of month with timezone", () => {
		const result = DChrono.getDayOfMonth(
			DChrono.createDate("2021-01-01"),
			"America/New_York",
		);

		expect(result).toBe(31);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfMonth returns day of month in UTC by default", () => {
		const result = DChrono.getDayOfMonth(
			DChrono.createDate("2021-12-25"),
		);

		expect(result).toBe(25);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2021-01-15"),
			DChrono.getDayOfMonth,
		);

		expect(result).toBe(15);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe with timezone", () => {
		const result = pipe(
			DChrono.createDate("2021-01-01"),
			(date) => DChrono.getDayOfMonth(date, "America/New_York"),
		);

		expect(result).toBe(31);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
