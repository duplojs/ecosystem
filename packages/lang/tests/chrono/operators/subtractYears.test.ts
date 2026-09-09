import { pipe, type ExpectType, DChrono } from "@scripts";

describe("subtractYears", () => {
	const baseDate = DChrono.createDate("2020-01-01");
	const beforeEpochDate = DChrono.createDate("-10-06-01");

	it("subtracts years from a date", () => {
		const result = DChrono.subtractYears(
			baseDate,
			2,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2018-01-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports negative numbers", () => {
		const result = DChrono.subtractYears(
			baseDate,
			(-3 as number),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2023-01-01")),
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
			DChrono.subtractYears(1),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-01-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.subtractYears(
			beforeEpochDate,
			2,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-12-06-01")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
