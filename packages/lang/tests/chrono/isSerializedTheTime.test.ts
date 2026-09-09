import { DChrono, type ExpectType } from "@scripts";

describe("isSerializedTheTime", () => {
	it("returns true for a safe serialized time", () => {
		const input = "time2000+" as string;
		const result = DChrono.isSerializedTheTime(input);

		expect(result).toBe(true);

		if (result) {
			type _CheckInput = ExpectType<
				typeof input,
				DChrono.SerializedTheTime,
				"strict"
			>;
		}
	});

	it("returns true for a safe negative serialized time", () => {
		expect(DChrono.isSerializedTheTime("time2000-")).toBe(true);
	});

	it("returns false for an unsafe serialized time", () => {
		expect(DChrono.isSerializedTheTime("time9007199254740991+")).toBe(false);
	});

	it("returns false for another serialized kind", () => {
		expect(DChrono.isSerializedTheTime("date1000+")).toBe(false);
	});

	it("returns false for an invalid value", () => {
		expect(DChrono.isSerializedTheTime("02:00")).toBe(false);
	});
});
