import { pipe, type ExpectType, DChrono } from "@scripts";

describe("getFirstDayOfWeek", () => {
	it("returns Monday of the same week for midweek date", () => {
		const result = DChrono.getFirstDayOfWeek(
			DChrono.createDate("2024-01-03", {
				hour: "15",
				minute: "30",
			}),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("returns the same date when already Monday", () => {
		const result = DChrono.getFirstDayOfWeek(
			DChrono.createDate("2024-01-01"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("returns previous Monday for Sunday input", () => {
		const result = DChrono.getFirstDayOfWeek(
			DChrono.createDate("2024-01-07"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-01")),
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
			DChrono.getFirstDayOfWeek,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2021-01-04")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.getFirstDayOfWeek(
			DChrono.createDate("1969-07-16"),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("1969-07-14")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
