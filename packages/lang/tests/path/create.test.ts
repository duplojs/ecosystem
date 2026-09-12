import { DEither, DPath, type ExpectType } from "@scripts";

describe("create", () => {
	it.each([
		["", "."],
		[".", "."],
		["./foo", "foo"],
		["foo/../bar", "bar"],
		["foo//bar/", "foo/bar"],
		["/foo/../../bar", "/bar"],
		["foo/../../../bar", "../../bar"],
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

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Success<string & DPath.Path>
			| DEither.Error<string>,
			"strict"
		>;
	});
});
