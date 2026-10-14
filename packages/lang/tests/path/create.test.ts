import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DPath from "@scripts/path";

describe("create", () => {
	it.each([
		["", "."],
		[".", "."],
		["./foo", "foo"],
		["foo/../bar", "bar"],
		["foo//bar/", "foo/bar"],
		["/foo/../../bar", "/bar"],
		["foo/../../../bar", "../../bar"],
		["file:///project/src/main.ts", "/project/src/main.ts"],
		["file:///project/call%20site/%C3%A9%23/main.ts", "/project/call site/é#/main.ts"],
	] as const)(
		"creates a normalized path from %j",
		(value, expected) => {
			const result = DPath.create(value);

			expect(DEither.isRight(result)).toBe(true);
			if (DEither.isRight(result)) {
				const path = DEither.unwrapRight(result);

				expect(path).toBe(expected);
				expect(DPath.is(path)).toBe(true);
			}
		},
	);

	it.each([
		"foo\0bar",
		"\0foo",
		"foo\0",
		"file:///foo%00bar",
		"file:///foo%GG",
		"file://remote-host/foo",
	] as const)(
		"returns an error with the original input for invalid path %j",
		(value) => {
			const result = DPath.create(value);

			expect(result).toStrictEqual(DEither.error(value));
		},
	);

	it("returns either a path success or an input error", () => {
		const value = "foo/../bar";
		const result = DPath.create(value);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Success<string & DPath.Path>
			| DEither.Error<string>,
			"strict"
		>;
	});
});
