import { DArray, type DNumber, DString, pipe, type ExpectType } from "@scripts";

describe("split", () => {
	it("should split string with separator", () => {
		const result = DString.split("a,b,c", ",");
		expect(result).toEqual(["a", "b", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<3> & DArray.LengthEqual<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should split string with limit", () => {
		const result = DString.split("a,b,c,d", ",", { limit: 2 });
		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<2> & DArray.LengthEqual<2> & DArray.MaxElements<2>,
			"strict"
		>;
	});

	it("should split string with regex separator", () => {
		const result = DString.split("a,b;c:d", /[,;:]/);
		expect(result).toEqual(["a", "b", "c", "d"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<1>,
			"strict"
		>;
	});

	it("should split string with regex separator and limit", () => {
		const result = DString.split("a,b;c:d", /[,;:]/, { limit: 3 });
		expect(result).toEqual(["a", "b", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<1>,
			"strict"
		>;
	});

	it("should handle empty string", () => {
		const result = DString.split("", ",");
		expect(result).toEqual([""]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<1> & DArray.LengthEqual<1> & DArray.MaxElements<1>,
			"strict"
		>;
	});

	it("should handle separator not found", () => {
		const result = DString.split("hello", ",");
		expect(result).toEqual(["hello"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<1> & DArray.LengthEqual<1> & DArray.MaxElements<1>,
			"strict"
		>;
	});

	it("limit 0", () => {
		const result = DString.split("a-b-c-d-e", "-", { limit: 0 });
		expect(result).toStrictEqual([]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MinElements<0> & DArray.LengthEqual<0> & DArray.MaxElements<0>,
			"strict"
		>;
	});

	it("should require a positive integer limit", () => {
		const limit = 1 as number & DNumber.StrictPositive;

		// @ts-expect-error limit requires both positive and integer guarantees.
		DString.split("a,b,c", ",", { limit });
	});

	it("use in pipe", () => {
		const result = pipe(
			"apple,banana,cherry",
			DString.split(","),
			DArray.map(DString.toUpperCase),
		);
		expect(result).toEqual(["APPLE", "BANANA", "CHERRY"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly Uppercase<string>[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});
});
