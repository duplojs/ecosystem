import { DCommon, type ExpectType } from "@scripts";

describe("stringToMillisecond", () => {
	it("converts supported units to milliseconds", () => {
		expect(DCommon.stringToMillisecond("12ms")).toBe(12);
		expect(DCommon.stringToMillisecond("5s")).toBe(5_000);
		expect(DCommon.stringToMillisecond("13m")).toBe(780_000);
		expect(DCommon.stringToMillisecond("2h")).toBe(7_200_000);
		expect(DCommon.stringToMillisecond("1d")).toBe(86_400_000);
		expect(DCommon.stringToMillisecond("5.5w")).toBe(3_326_400_000);
	});

	it("adds additional string inputs recursively", () => {
		expect(DCommon.stringToMillisecond("1m", "5s", "250ms")).toBe(65_250);
	});

	it("returns numeric inputs directly", () => {
		const result = DCommon.stringToMillisecond(200);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(200);
	});

	it("throws a typed error for invalid strings", () => {
		expect(
			() => DCommon.stringToMillisecond("invalid" as never),
		).toThrowError(DCommon.InvalidMillisecondInStringError);
	});
});
