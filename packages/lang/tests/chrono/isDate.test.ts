import { DChrono, pipe, when, type ExpectType } from "@scripts";

describe("DChrono.isDate", () => {
	it("returns true for valid TheDate values", () => {
		const valid = DChrono.createDateOrThrow(1700000000);
		expect(DChrono.isDate(valid)).toBe(true);

		if (DChrono.isDate(valid)) {
			type Check = ExpectType<
				typeof valid,
				DChrono.TheDate,
				"strict"
			>;
		}
	});

	it("narrows a TheDate inside a pipe when callback", () => {
		const valid = DChrono.createDateOrThrow(1700000000);
		const source = valid as object;
		const result = pipe(
			source,
			when(
				DChrono.isDate,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						DChrono.TheDate,
						"strict"
					>;

					return DChrono.toTimestamp(value);
				},
			),
		);

		expect(result).toBe(1700000000);
	});

	it("returns false for invalid strings", () => {
		expect(DChrono.isDate("not-a-date")).toBe(false);
		expect(DChrono.isDate("date-+")).toBe(false);
	});
});
