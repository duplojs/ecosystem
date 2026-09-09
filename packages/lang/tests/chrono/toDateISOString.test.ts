import { pipe, type ExpectType, DChrono } from "@scripts";

describe("toISOString", () => {
	it("toISOString converts positive TheDate to ISO string", () => {
		const result = DChrono.toDateISOString("date1609459200000+");

		expect(result).toBe("2021-01-01T00:00:00.000Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("toISOString converts negative TheDate to ISO string", () => {
		const result = DChrono.toDateISOString("date1000-");

		expect(result).toBe("1969-12-31T23:59:59.000Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("toISOString converts date with time to ISO string", () => {
		const result = DChrono.toDateISOString(
			DChrono.createDate("2021-06-15", {
				hour: "14",
				minute: "30",
				second: "45",
				millisecond: "123",
			}),
		);

		expect(result).toBe("2021-06-15T14:30:45.123Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("toISOString converts midnight date to ISO string", () => {
		const result = DChrono.toDateISOString(
			DChrono.createDate("2021-12-25"),
		);

		expect(result).toBe("2021-12-25T00:00:00.000Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("toISOString converts leap year date to ISO string", () => {
		const result = DChrono.toDateISOString(
			DChrono.createDate("2020-02-29"),
		);

		expect(result).toBe("2020-02-29T00:00:00.000Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDateOrThrow(1609459200000),
			DChrono.toDateISOString,
		);

		expect(result).toBe("2021-01-01T00:00:00.000Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("use in pipe with date creation", () => {
		const result = pipe(
			DChrono.createDate("2021-06-15", {
				hour: "14",
				minute: "30",
				second: "45",
				millisecond: "123",
			}),
			DChrono.toDateISOString,
		);

		expect(result).toBe("2021-06-15T14:30:45.123Z");

		type check = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
