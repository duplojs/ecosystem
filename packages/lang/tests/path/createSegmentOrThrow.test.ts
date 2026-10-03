import * as DPath from "@scripts/path";
import type * as DCommon from "@scripts/common";

describe("createSegmentOrThrow", () => {
	it.each([
		["foo", "foo"],
		["./foo/", "foo"],
		["foo/../bar", "bar"],
		["foo/bar/..", "foo"],
	])("normalizes %j into %j", (input, expected) => {
		const result = DPath.createSegmentOrThrow(input);

		expect(result).toBe(expected);
		expect(DPath.isSegment(result)).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment, "strict">;
	});

	it.each([
		"",
		".",
		"..",
		"foo/bar",
		"/foo",
		"foo\u0000bar",
	])("throws with the original invalid input %j", (input) => {
		expect(() => DPath.createSegmentOrThrow(input)).toThrow(DPath.CreateSegmentPathError);
	});

	it("exposes the invalid value and diagnostic message on the error", () => {
		const error = new DPath.CreateSegmentPathError("invalid");

		expect(error).toBeInstanceOf(Error);
		expect(error.value).toBe("invalid");
		expect(error.message).toBe("Invalid segment path: invalid");
	});
});
