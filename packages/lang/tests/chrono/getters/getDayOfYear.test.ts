import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getDayOfYear", () => {
	it("getDayOfYear returns day 1 for January 1st", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2021-01-01"),
		);

		expect(result).toBe(1);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear returns day 32 for February 1st", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2021-02-01"),
		);

		expect(result).toBe(32);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear returns day 365 for December 31st (non-leap year)", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2021-12-31"),
		);

		expect(result).toBe(365);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear returns day 366 for December 31st (leap year)", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2020-12-31"),
		);

		expect(result).toBe(366);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear returns day 60 for February 29th (leap year)", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2020-02-29"),
		);

		expect(result).toBe(60);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear returns correct day for mid-year date", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2021-06-15"),
		);

		expect(result).toBe(166);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfYear with timezone", () => {
		const result = DChrono.getDayOfYear(
			DChrono.createDate("2020-01-01"),
			"America/New_York",
		);

		expect(result).toBe(365);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2020-01-01"),
			DChrono.getDayOfYear,
		);

		expect(result).toBe(1);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe with timezone", () => {
		const result = pipe(
			DChrono.createDate("2020-01-01"),
			(date) => DChrono.getDayOfYear(date, "America/New_York"),
		);

		expect(result).toBe(365);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
