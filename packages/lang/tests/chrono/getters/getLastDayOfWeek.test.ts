import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getLastDayOfWeek", () => {
	it("returns Sunday end of day for midweek date", () => {
		const result = DChrono.getLastDayOfWeek(
			DChrono.createDate("2024-01-03", {
				hour: "15",
				minute: "30",
			}),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-07", {
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

	it("returns Sunday for Monday input", () => {
		const result = DChrono.getLastDayOfWeek(
			DChrono.createDate("2024-01-01"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-07", {
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

	it("returns same Sunday at end of day for Sunday input", () => {
		const result = DChrono.getLastDayOfWeek(
			DChrono.createDate("2024-01-07", { hour: "10" }),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-07", {
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
			DChrono.createDate("2021-01-06"),
			DChrono.getLastDayOfWeek,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2021-01-10", {
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
		const result = DChrono.getLastDayOfWeek(
			DChrono.createDate("1969-07-16"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("1969-07-20", {
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
