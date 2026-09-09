import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getMinute", () => {
	it("getMinute returns minute in UTC", () => {
		const result = DChrono.getMinute(
			DChrono.createDate("2021-01-01", {
				hour: "12",
				minute: "30",
			}),
		);

		expect(result).toBe(30);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMinute returns 0 when no minutes", () => {
		const result = DChrono.getMinute(
			DChrono.createDate("2021-01-01", { hour: "12" }),
		);

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMinute returns 59 for max minutes", () => {
		const result = DChrono.getMinute(
			DChrono.createDate("2021-01-01", {
				hour: "12",
				minute: "59",
			}),
		);

		expect(result).toBe(59);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getMinute returns minute with timezone", () => {
		const result = DChrono.getMinute(
			DChrono.createDate("2021-01-01", { minute: "45" }),
			"America/New_York",
		);

		expect(result).toBe(45);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2021-01-01", {
				hour: "12",
				minute: "30",
			}),
			DChrono.getMinute,
		);

		expect(result).toBe(30);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe with timezone", () => {
		const result = pipe(
			DChrono.createDate("2021-01-01", { minute: "45" }),
			(date) => DChrono.getMinute(date, "America/New_York"),
		);

		expect(result).toBe(45);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
