import { DChrono, type ExpectType } from "@scripts";

describe("serialize", () => {
	it("serializes a date", () => {
		const result = DChrono.serialize(
			DChrono.createDate("2024-01-01"),
		);

		expect(result).toBe("date1704067200000+");

		type _CheckResult = ExpectType<
			typeof result,
			DChrono.SerializedTheDate,
			"strict"
		>;
	});

	it("serializes a negative date", () => {
		const result = DChrono.serialize(
			DChrono.createDateOrThrow(-1_000),
		);

		expect(result).toBe("date1000-");
	});

	it("serializes a time", () => {
		const result = DChrono.serialize(
			DChrono.createTime(2, "second"),
		);

		expect(result).toBe("time2000+");

		type _CheckResult = ExpectType<
			typeof result,
			DChrono.SerializedTheTime,
			"strict"
		>;
	});

	it("serializes a negative time", () => {
		const result = DChrono.serialize(
			DChrono.createTime(-2, "second"),
		);

		expect(result).toBe("time2000-");
	});
});
