import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("getFirstDayOfMonth", () => {
	it("returns first day start for mid-month date", () => {
		const result = DChrono.getFirstDayOfMonth(
			DChrono.createDate("2024-02-15", { hour: "10" }),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-02-01")),
		);

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("returns same date when already first day", () => {
		const result = DChrono.getFirstDayOfMonth(
			DChrono.createDate("2024-02-01"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-02-01")),
		);

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles date before Christ", () => {
		const result = DChrono.getFirstDayOfMonth(
			DChrono.createDate("-5-03-15"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-5-03-01")),
		);

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("can be used in pipe", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2021-12-25"),
			DChrono.getFirstDayOfMonth,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2021-12-01")),
		);

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
