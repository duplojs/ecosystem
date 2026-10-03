import * as DPath from "@scripts/path";
import * as DEither from "@scripts/either";
import type * as DCommon from "@scripts/common";

describe("createAbsolute", () => {
	it.each([
		["/", "/"],
		["/foo/../bar//", "/bar"],
		["///", "/"],
	])("normalizes %j into %j", (input, expected) => {
		const result = DPath.createAbsolute(input);
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);
		expect(DPath.isAbsolute(value)).toBe(true);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string & DPath.Absolute> | DEither.Error<string>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Absolute, "strict">;
	});

	it.each([
		"",
		"foo",
		"../foo",
		"/foo\u0000bar",
	])("returns the original invalid input %j", (input) => {
		const result = DPath.createAbsolute(input);

		expect(DEither.unwrapByInformationOrThrow(result, "error")).toBe(input);
	});
});
