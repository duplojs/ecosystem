import { DChrono } from "@scripts";

describe("createTimeOrThrow", () => {
	it("creates from milliseconds", () => {
		const result = DChrono.createTimeOrThrow(5000);

		expect(DChrono.serialize(result)).toBe("time5000+");
	});

	it("creates from negative milliseconds", () => {
		const result = DChrono.createTimeOrThrow(-1000);

		expect(DChrono.serialize(result)).toBe("time1000-");
	});

	it("creates from TheTime string", () => {
		const value: DChrono.SerializedTheTime = "time42-";

		expect(DChrono.serialize(DChrono.createTimeOrThrow(value))).toBe(value);
	});

	it("creates from ISO time value", () => {
		const result = DChrono.createTimeOrThrow({
			value: "01:00:00.000",
		});

		expect(DChrono.serialize(result)).toBe(`time${DChrono.millisecondInOneHour}+`);
	});

	it("creates from spooling value number", () => {
		const result = DChrono.createTimeOrThrow({
			value: 2500,
		});

		expect(DChrono.serialize(result)).toBe("time2500+");
	});

	it("throws when time value is unsafe", () => {
		expect(() => DChrono.createTimeOrThrow(Number.MAX_SAFE_INTEGER + 1)).toThrow(DChrono.CreateTheTimeError);
	});

	it("throws when time value hits the limits", () => {
		expect(() => DChrono.createTimeOrThrow(DChrono.maxTimeValue)).toThrow(DChrono.CreateTheTimeError);
		expect(() => DChrono.createTimeOrThrow(DChrono.minTimeValue)).toThrow(DChrono.CreateTheTimeError);
	});

	it("throws when spooling value is NaN", () => {
		expect(() => DChrono.createTimeOrThrow({ value: Number.NaN })).toThrow(DChrono.CreateTheTimeError);
	});
});
