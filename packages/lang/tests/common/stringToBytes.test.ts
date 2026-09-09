import { DCommon, type ExpectType } from "@scripts";

describe("stringToBytes", () => {
	it("converts supported units to bytes", () => {
		expect(DCommon.stringToBytes("12b")).toBe(12);
		expect(DCommon.stringToBytes("1kb")).toBe(1024);
		expect(DCommon.stringToBytes("5.6mb")).toBe(5_872_025);
		expect(DCommon.stringToBytes("1gb")).toBe(1_073_741_824);
		expect(DCommon.stringToBytes("1tb")).toBe(1_099_511_627_776);
		expect(DCommon.stringToBytes("1pb")).toBe(1_125_899_906_842_624);
	});

	it("returns numeric inputs directly", () => {
		const result = DCommon.stringToBytes(2048);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(2048);
	});

	it("throws a typed error for invalid strings", () => {
		expect(
			() => DCommon.stringToBytes("invalid" as never),
		).toThrowError(DCommon.InvalidBytesInStringError);
	});
});
