import { pipe, type ExpectType, DChrono } from "@scripts";

describe("subtractWeeks", () => {
	const baseDate = DChrono.createDate("2020-01-01");
	const beforeEpochDate = DChrono.createDate("-10-01-15");

	it("subtracts weeks from a date", () => {
		const result = DChrono.subtractWeeks(
			baseDate,
			1,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-25")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports negative numbers", () => {
		const result = DChrono.subtractWeeks(
			baseDate,
			(-2 as number),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2020-01-15")),
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
			DChrono.subtractWeeks(1),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-25")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.subtractWeeks(
			beforeEpochDate,
			2,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-10-01-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
