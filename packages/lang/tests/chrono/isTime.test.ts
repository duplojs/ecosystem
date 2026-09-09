import { DChrono, pipe, when, type ExpectType } from "@scripts";

describe("isTime", () => {
	it("returns true for valid TheTime values", () => {
		const valid = DChrono.createTimeOrThrow(12345);

		expect(DChrono.isTime(valid)).toBe(true);
		expect(DChrono.isTime(DChrono.createTimeOrThrow(-12345))).toBe(true);

		if (DChrono.isTime(valid)) {
			type Check = ExpectType<
				typeof valid,
				DChrono.TheTime,
				"strict"
			>;
		}
	});

	it("narrows a TheTime inside a pipe when callback", () => {
		const valid = DChrono.createTimeOrThrow(12345);
		const source = valid as object;
		const result = pipe(
			source,
			when(
				DChrono.isTime,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						DChrono.TheTime,
						"strict"
					>;

					return DChrono.toTimeValue(value);
				},
			),
		);

		expect(result).toBe(12345);
	});

	it("returns false for invalid strings", () => {
		expect(DChrono.isTime("not-a-time")).toBe(false);
		expect(DChrono.isTime("time-+")).toBe(false);
	});
});
