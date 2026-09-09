import { pipe, type ExpectType, DChrono } from "@scripts";

describe("subtractDays", () => {
	const baseDate = DChrono.createDate("2020-01-01");
	const beforeEpochDate = DChrono.createDate("-10-01-10");

	it("subtracts days from a date", () => {
		const result = DChrono.subtractDays(
			baseDate,
			4,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-28")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports negative numbers", () => {
		const result = DChrono.subtractDays(
			baseDate,
			(-3 as number),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2020-01-04")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			baseDate,
			DChrono.subtractDays(1),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-31")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.subtractDays(
			beforeEpochDate,
			5,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-10-01-05")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
