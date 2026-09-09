import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getLastDayOfMonth", () => {
	it("returns month end for mid-month date", () => {
		const result = DChrono.getLastDayOfMonth(
			DChrono.createDate("2024-02-15", { hour: "10" }),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-02-29", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "999",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("returns same date when already last day", () => {
		const result = DChrono.getLastDayOfMonth(
			DChrono.createDate("2024-02-29", { hour: "20" }),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-02-29", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "999",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles thirty-day month", () => {
		const result = DChrono.getLastDayOfMonth(
			DChrono.createDate("2024-04-10"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-04-30", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "999",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2021-12-25"),
			DChrono.getLastDayOfMonth,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2021-12-31", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "999",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.getLastDayOfMonth(
			DChrono.createDate("1969-07-16"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("1969-07-31", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "999",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
