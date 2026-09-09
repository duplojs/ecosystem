import { pipe, type ExpectType, DChrono } from "@scripts";

describe("addHours", () => {
	const baseDate = DChrono.createDate("2020-01-01");
	const beforeEpochDate = DChrono.createDate("-10-01-01");

	it("adds hours to a date", () => {
		const result = DChrono.addHours(
			baseDate,
			6,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2020-01-01", { hour: "06" })),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports negative numbers", () => {
		const result = DChrono.addHours(
			baseDate,
			(-10 as number),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-31", { hour: "14" })),
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
			DChrono.addHours(1),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2020-01-01", { hour: "01" })),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.addHours(
			beforeEpochDate,
			6,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-10-01-01", { hour: "06" })),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
