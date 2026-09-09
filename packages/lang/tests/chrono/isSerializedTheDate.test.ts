import { DChrono, type ExpectType } from "@scripts";

describe("isSerializedTheDate", () => {
	it("returns true for a safe serialized date", () => {
		const input = "date1704067200000+" as string;
		const result = DChrono.isSerializedTheDate(input);

		expect(result).toBe(true);

		if (DChrono.isSerializedTheDate(input)) {
			type _CheckInput = ExpectType<
				typeof input,
				DChrono.SerializedTheDate,
				"strict"
			>;
		}
	});

	it("returns true for a safe negative serialized date", () => {
		expect(DChrono.isSerializedTheDate("date1000-")).toBe(true);
	});

	it("returns false for an unsafe serialized date", () => {
		expect(DChrono.isSerializedTheDate("date8640000000000001+")).toBe(false);
	});

	it("returns false for another serialized kind", () => {
		expect(DChrono.isSerializedTheDate("time1000+")).toBe(false);
	});

	it("returns false for an invalid value", () => {
		expect(DChrono.isSerializedTheDate("2024-01-01")).toBe(false);
	});
});
