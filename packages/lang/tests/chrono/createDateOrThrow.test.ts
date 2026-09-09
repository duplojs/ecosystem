import { DChrono } from "@scripts";

describe("createOrThrow", () => {
	it("creates from timestamp", () => {
		const result = DChrono.createDateOrThrow(1609459200000);

		expect(DChrono.serialize(result)).toBe("date1609459200000+");
	});

	it("creates from negative timestamp", () => {
		const result = DChrono.createDateOrThrow(-1000);

		expect(DChrono.serialize(result)).toBe("date1000-");
	});

	it("throws when timestamp is unsafe", () => {
		expect(() => DChrono.createDateOrThrow(Number.MAX_SAFE_INTEGER + 1)).toThrow(DChrono.CreateTheDateError);
	});

	it("throws when timestamp is out of range", () => {
		expect(() => DChrono.createDateOrThrow(DChrono.maxTimestamp + 1)).toThrow(DChrono.CreateTheDateError);
	});

	it("throws with wrong spooling Date", () => {
		expect(() => DChrono.createDateOrThrow({ value: NaN })).toThrow(DChrono.CreateTheDateError);
	});

	it("throws when timestamp hits the limits", () => {
		expect(() => DChrono.createDateOrThrow(DChrono.maxTimestamp)).toThrow(DChrono.CreateTheDateError);
		expect(() => DChrono.createDateOrThrow(DChrono.minTimestamp)).toThrow(DChrono.CreateTheDateError);
	});

	it("creates from Date object", () => {
		const nativeDate = new Date("2021-01-01T00:00:00.000Z");

		expect(DChrono.serialize(DChrono.createDateOrThrow(nativeDate))).toBe("date1609459200000+");
	});

	it("creates from Date object before epoch", () => {
		const nativeDate = new Date(-1000);

		expect(DChrono.serialize(DChrono.createDateOrThrow(nativeDate))).toBe("date1000-");
	});

	it("throws when Date object is invalid", () => {
		expect(() => DChrono.createDateOrThrow(new Date(NaN))).toThrow(DChrono.CreateTheDateError);
	});

	it("throws when Date object has out-of-range timestamp", () => {
		expect(() => DChrono.createDateOrThrow(new Date(DChrono.maxTimestamp + 1))).toThrow(DChrono.CreateTheDateError);
		expect(() => DChrono.createDateOrThrow(new Date(DChrono.minTimestamp - 1))).toThrow(DChrono.CreateTheDateError);
	});

	it("creates from TheDate string", () => {
		const value: DChrono.SerializedTheDate = "date42-";

		expect(DChrono.serialize(DChrono.createDateOrThrow(value))).toBe(value);
	});

	it("throws when TheDate magnitude is invalid", () => {
		const invalid = "date9007199254740992+";

		expect(() => DChrono.createDateOrThrow(invalid)).toThrow(DChrono.CreateTheDateError);
	});

	it("creates from Date before Christ", () => {
		const input = new Date(Date.UTC(-100, 0, 1));
		const timestamp = input.getTime();

		expect(DChrono.serialize(DChrono.createDateOrThrow(input))).toBe(`date${Math.abs(timestamp)}-`);
	});

	it("throws when string does not match any known pattern", () => {
		expect(() => DChrono.createDateOrThrow("not-a-date" as any)).toThrow(DChrono.CreateTheDateError);
	});

	it("throws when TheDate matches timestamp boundary", () => {
		expect(() => DChrono.createDateOrThrow(`date${DChrono.maxTimestamp}+`)).toThrow(DChrono.CreateTheDateError);
		expect(() => DChrono.createDateOrThrow(`date${Math.abs(DChrono.minTimestamp)}-`)).toThrow(DChrono.CreateTheDateError);
	});

	it("throws when runtime type is unsupported", () => {
		expect(() => DChrono.createDateOrThrow("date99999999999999999999999999999999999999+")).toThrow(DChrono.CreateTheDateError);
	});
});
