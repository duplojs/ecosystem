import { pipe, type ExpectType, DChrono } from "@scripts";

describe("subtractMilliseconds", () => {
	const baseDate = DChrono.createDate("2020-01-01");
	const beforeEpochDate = DChrono.createDate("-10-01-01", { second: "01" });

	it("subtracts milliseconds from a date", () => {
		const result = DChrono.subtractMilliseconds(
			baseDate,
			250,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-31", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "750",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports negative numbers", () => {
		const result = DChrono.subtractMilliseconds(
			baseDate,
			(-400 as number),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2020-01-01", { millisecond: "400" })),
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
			DChrono.subtractMilliseconds(100),
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2019-12-31", {
				hour: "23",
				minute: "59",
				second: "59",
				millisecond: "900",
			})),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("handles dates before 1970", () => {
		const result = DChrono.subtractMilliseconds(
			beforeEpochDate,
			250,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-10-01-01", { millisecond: "750" })),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
