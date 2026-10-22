import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import * as DCommon from "@scripts/common";

describe("split", () => {
	it("should split with a string separator directly and in pipe", () => {
		const result = DString.split("a,b,c", ",");
		const pipedResult = DCommon.pipe(
			"a,b,c",
			DString.split(","),
			DArray.map(DString.toUpperCase),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<3> & DArray.LengthEqual<3> & DArray.MaxElements<3>,
			"strict"
		>;
		type _CheckPipedResult = DCommon.ExpectType<
			typeof pipedResult,
			readonly Uppercase<string>[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;

		expect(result).toStrictEqual(["a", "b", "c"]);
		expect(pipedResult).toStrictEqual(["A", "B", "C"]);
	});

	it("should split string with limit", () => {
		const result = DString.split("a,b,c,d", ",", { limit: 2 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<2> & DArray.LengthEqual<2> & DArray.MaxElements<2>,
			"strict"
		>;

		expect(result).toStrictEqual(["a", "b"]);
	});

	it("should filter unmatched regex captures and preserve empty and present captures", () => {
		const separator = DCommon.forward<string | RegExp>(/(a)|(b)()/);
		const result = DString.split("b", /(a)|(b)()/);
		const pipedResult = DCommon.pipe("b", DString.split(separator));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1>,
			"strict"
		>;
		type _CheckPipedResult = DCommon.ExpectType<typeof pipedResult, typeof result, "strict">;

		expect(result).toStrictEqual(["", "b", "", ""]);
		expect(pipedResult).toStrictEqual(["", "b", "", ""]);
	});

	it("should apply the regex limit before filtering unmatched captures", () => {
		const result = DString.split("a,b;c", /(,)|(;)/, { limit: 4 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1>,
			"strict"
		>;

		expect(result).toStrictEqual(["a", ",", "b"]);
	});

	it("should distribute string separator unions directly and in pipe", () => {
		const separator = DCommon.forward<"," | ";">(",");
		const result = DString.split("a,b,c", separator);
		const pipedResult = DCommon.pipe("a,b,c", DString.split(separator));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| (readonly string[] & DArray.MinElements<3> & DArray.LengthEqual<3> & DArray.MaxElements<3>)
			| (readonly string[] & DArray.MinElements<1> & DArray.LengthEqual<1> & DArray.MaxElements<1>),
			"strict"
		>;
		type _CheckPipedResult = DCommon.ExpectType<typeof pipedResult, typeof result, "strict">;

		expect(result).toStrictEqual(["a", "b", "c"]);
		expect(pipedResult).toStrictEqual(["a", "b", "c"]);
	});

	it("should handle separator not found", () => {
		const result = DString.split("hello", ",");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1> & DArray.LengthEqual<1> & DArray.MaxElements<1>,
			"strict"
		>;

		expect(result).toStrictEqual(["hello"]);
	});

	it("should return an empty string when the limit is zero", () => {
		const result = DString.split("a-b-c-d-e", "-", { limit: 0 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1> & DArray.LengthEqual<1> & DArray.MaxElements<1>,
			"strict"
		>;

		expect(result).toStrictEqual([""]);
	});

	it("should accept nonliteral limits and ignore negative or fractional limits", () => {
		const limit = DCommon.forward<number>(2);
		const result = DString.split("a,b,c", ",", { limit });
		const negativeResult = DString.split("a,b,c", ",", { limit: -1 });
		const fractionalResult = DString.split("a,b,c", ",", { limit: 1.5 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1>,
			"strict"
		>;
		type _CheckNegativeResult = DCommon.ExpectType<typeof negativeResult, typeof result, "strict">;
		type _CheckFractionalResult = DCommon.ExpectType<typeof fractionalResult, typeof result, "strict">;

		expect(result).toStrictEqual(["a", "b"]);
		expect(negativeResult).toStrictEqual(["a", "b", "c"]);
		expect(fractionalResult).toStrictEqual(["a", "b", "c"]);
	});

	it.each([
		{
			separator: "",
			expected: [""],
		},
		{
			separator: /(?:)/,
			expected: [""],
		},
	])("should return a nonempty array for empty input with $separator", ({ separator, expected }) => {
		const result = DString.split("", separator);
		const pipedResult = DCommon.pipe("", DString.split(separator));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<1>,
			"strict"
		>;
		type _CheckPipedResult = DCommon.ExpectType<typeof pipedResult, typeof result, "strict">;

		expect(result).toStrictEqual(expected);
		expect(pipedResult).toStrictEqual(expected);
	});
});
