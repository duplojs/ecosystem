import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getMonth", () => {
	it("getMonth returns month in UTC (January)", () => {
		const result = DChrono.getMonth(
			DChrono.createDate("2021-01-01"),
		);

		expect(result).toBe(1);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMonth returns month in UTC (December)", () => {
		const result = DChrono.getMonth(
			DChrono.createDate("2021-12-25"),
		);

		expect(result).toBe(12);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMonth returns month with timezone", () => {
		const result = DChrono.getMonth(
			DChrono.createDate("2021-01-01"),
			"America/New_York",
		);

		expect(result).toBe(12);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMonth returns month in UTC (June)", () => {
		const result = DChrono.getMonth(
			DChrono.createDate("2021-06-15"),
		);

		expect(result).toBe(6);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2021-01-01"),
			DChrono.getMonth,
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
			DChrono.createDate("2021-01-01"),
			(date) => DChrono.getMonth(date, "America/New_York"),
		);

		expect(result).toBe(12);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
