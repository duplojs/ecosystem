import * as DPath from "@scripts/path";
import type * as DCommon from "@scripts/common";

describe("createAbsoluteOrThrow", () => {
	it.each([
		["/", "/"],
		["/foo/../bar//", "/bar"],
		["///", "/"],
	])("normalizes %j into %j", (input, expected) => {
		const result = DPath.createAbsoluteOrThrow(input);

		expect(result).toBe(expected);
		expect(DPath.isAbsolute(result)).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Absolute, "strict">;
	});

	it.each([
		"",
		"foo",
		"../foo",
		"/foo\u0000bar",
	])("throws with the original invalid input %j", (input) => {
		expect(() => DPath.createAbsoluteOrThrow(input)).toThrow(DPath.CreateAbsolutePathError);
	});

	it("exposes the invalid value and diagnostic message on the error", () => {
		const error = new DPath.CreateAbsolutePathError("invalid");

		expect(error).toBeInstanceOf(Error);
		expect(error.value).toBe("invalid");
		expect(error.message).toBe("Invalid absolute path: invalid");
	});
});
