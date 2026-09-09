import { DArray, DChrono, type ExpectType } from "@scripts";

describe("eachDate", () => {
	it("should iterate forward by day and include an aligned end date", () => {
		const result = DChrono.eachDate({
			start: DChrono.createDate("2020-01-01"),
			end: DChrono.createDate("2020-01-03"),
		});

		expect(DArray.from(result).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-02T00:00:00.000Z",
			"2020-01-03T00:00:00.000Z",
		]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<DChrono.TheDate, unknown, unknown>,
			"strict"
		>;
	});

	it("should iterate backward and stop before a non aligned end date", () => {
		const result = DChrono.eachDate({
			start: DChrono.createDate("2020-01-03"),
			end: DChrono.createDate("2020-01-01", { hour: "12" }),
		});

		expect(DArray.from(result).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-03T00:00:00.000Z",
			"2020-01-02T00:00:00.000Z",
		]);
	});

	it("should accept a serialized start date", () => {
		const start = DChrono.serialize(DChrono.createDate("2020-01-01"));
		const result = DChrono.eachDate({
			start,
			end: DChrono.createDate("2020-01-02"),
		});

		expect(DArray.from(result).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-02T00:00:00.000Z",
		]);
	});

	it("should support time based units", () => {
		const start = DChrono.createDate("2020-01-01");

		expect(DArray.from(DChrono.eachDate({
			start,
			end: DChrono.createDate("2020-01-01", { millisecond: "002" }),
		}, "millisecond")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-01T00:00:00.001Z",
			"2020-01-01T00:00:00.002Z",
		]);

		expect(DArray.from(DChrono.eachDate({
			start,
			end: DChrono.createDate("2020-01-01", { second: "02" }),
		}, "second")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-01T00:00:01.000Z",
			"2020-01-01T00:00:02.000Z",
		]);

		expect(DArray.from(DChrono.eachDate({
			start,
			end: DChrono.createDate("2020-01-01", { minute: "02" }),
		}, "minute")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-01T00:01:00.000Z",
			"2020-01-01T00:02:00.000Z",
		]);

		expect(DArray.from(DChrono.eachDate({
			start,
			end: DChrono.createDate("2020-01-01", { hour: "02" }),
		}, "hour")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-01-01T01:00:00.000Z",
			"2020-01-01T02:00:00.000Z",
		]);
	});

	it("should support month and year units", () => {
		expect(DArray.from(DChrono.eachDate({
			start: DChrono.createDate("2020-01-01"),
			end: DChrono.createDate("2020-03-01"),
		}, "month")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2020-02-01T00:00:00.000Z",
			"2020-03-01T00:00:00.000Z",
		]);

		expect(DArray.from(DChrono.eachDate({
			start: DChrono.createDate("2020-01-01"),
			end: DChrono.createDate("2022-01-01"),
		}, "year")).map(DChrono.toDateISOString)).toStrictEqual([
			"2020-01-01T00:00:00.000Z",
			"2021-01-01T00:00:00.000Z",
			"2022-01-01T00:00:00.000Z",
		]);
	});
});
