import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getDayOfWeek", () => {
	it("getDayOfWeek returns day of week in UTC (Friday)", () => {
		const result = DChrono.getDayOfWeek(
			DChrono.createDate("2021-01-01"),
		);

		expect(result).toBe(5);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfWeek returns day of week with timezone", () => {
		const result = DChrono.getDayOfWeek(
			DChrono.createDate("2021-01-01"),
			"America/New_York",
		);

		expect(result).toBe(4);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfWeek returns day of week in UTC (Sunday)", () => {
		const result = DChrono.getDayOfWeek(
			DChrono.createDate("2021-01-03"),
		);

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getDayOfWeek returns day of week in UTC (Saturday)", () => {
		const result = DChrono.getDayOfWeek(
			DChrono.createDate("2021-01-02"),
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
			DChrono.getDayOfWeek,
		);

		expect(result).toBe(5);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe with timezone", () => {
		const result = pipe(
			DChrono.createDate("2021-01-01"),
			(date) => DChrono.getDayOfWeek(date, "America/New_York"),
		);

		expect(result).toBe(4);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
