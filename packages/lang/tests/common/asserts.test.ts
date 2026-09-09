import { DCommon, type ExpectType, pipe } from "@scripts";

describe("asserts", () => {
	it("narrows the input when the predicate accepts it", () => {
		const input = "value" as string | number;

		DCommon.asserts(
			input,
			(value): value is string => typeof value === "string",
		);

		type _CheckInput = ExpectType<
			typeof input,
			string,
			"strict"
		>;

		expect(input.toUpperCase()).toBe("VALUE");
	});

	it("throws a typed error when the predicate rejects the input", () => {
		expect(
			() => DCommon.asserts(
				10 as string | number,
				(value): value is string => typeof value === "string",
			),
		).toThrowError(DCommon.AssertsError);
	});
});
