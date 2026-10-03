import * as DPath from "@scripts/path";
import * as DEither from "@scripts/either";
import type * as DCommon from "@scripts/common";

describe("createSegment", () => {
	it.each([
		["foo", "foo"],
		["./foo/", "foo"],
		["foo/../bar", "bar"],
		["foo/bar/..", "foo"],
	])("normalizes %j into %j", (input, expected) => {
		const result = DPath.createSegment(input);
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);
		expect(DPath.isSegment(value)).toBe(true);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string & DPath.Segment> | DEither.Error<string>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Segment, "strict">;
	});

	it.each([
		"",
		".",
		"..",
		"foo/bar",
		"/foo",
		"foo\u0000bar",
	])("returns the original invalid input %j", (input) => {
		const result = DPath.createSegment(input);

		expect(DEither.unwrapByInformationOrThrow(result, "error")).toBe(input);
	});
});
