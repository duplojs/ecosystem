import { DChrono, type ExpectType, pipe } from "@scripts";

describe("TheTime", () => {
	it("returns the stored time value", () => {
		const baseTime = DChrono.createTime(1_500, "millisecond");

		const result = baseTime.toNative();

		expect(result).toBe(1500);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("serializes with toString and toJSON", () => {
		const baseTime = DChrono.createTime(2_000, "millisecond");

		const asString = baseTime.toString();
		const asJson = baseTime.toJSON();

		expect(asString).toBe(DChrono.serialize(baseTime));
		expect(asJson).toBe(DChrono.serialize(baseTime));

		type check = ExpectType<
			typeof asString,
			DChrono.SerializedTheTime,
			"strict"
		>;
	});

	it("works inside pipe with instance methods", () => {
		const baseTime = DChrono.createTime(3_000, "millisecond");

		const result = pipe(
			baseTime,
			(value) => value.toNative(),
		);

		expect(result).toBe(3000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
