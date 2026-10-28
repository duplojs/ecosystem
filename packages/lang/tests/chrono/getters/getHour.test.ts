import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("getHour", () => {
	it("getHour returns hour in UTC", () => {
		const result = DChrono.getHour(
			DChrono.createDate("2021-01-01", { hour: "15" }),
		);

		expect(result).toBe(15);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getHour returns hour with timezone", () => {
		const result = DChrono.getHour(
			DChrono.createDate("2021-01-01"),
			"America/New_York",
		);

		expect(result).toBe(19);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getHour returns 0 for midnight", () => {
		const result = DChrono.getHour(
			DChrono.createDate("2021-01-01"),
		);

		expect(result).toBe(0);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("getHour returns 23 for last hour", () => {
		const result = DChrono.getHour(
			DChrono.createDate("2021-01-01", { hour: "23" }),
		);

		expect(result).toBe(23);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2021-01-01", { hour: "15" }),
			DChrono.getHour,
		);

		expect(result).toBe(15);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe with timezone", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2021-01-01"),
			(date) => DChrono.getHour(date, "America/New_York"),
		);

		expect(result).toBe(19);

		type check = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
