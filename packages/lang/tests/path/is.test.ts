import type * as DCommon from "@scripts/common";
import * as DPath from "@scripts/path";
import * as DString from "@scripts/string";

const validPaths = [
	"foo/bar",
	"foo",
	"../foo",
	"../../foo/bar",
	".",
	"..",
	"../..",
	"/foo/bar",
	"/foo",
	"/",
	"foo bar/baz",
	"foo-bar_42/@scope",
	"dossier/été/élément",
	".git/config",
	"src/index.ts",
	".../..foo",
	"/.../..foo",
	"../a/..b",
	"foo/.\n",
	"foo/..\r",
	"foo\n/bar",
	"foo\\bar",
	"file:/foo",
] as const;

const invalidPaths = [
	"",
	"./foo",
	"foo/./bar",
	"foo/.",
	"foo/../bar",
	"foo/..",
	"../foo/../bar",
	"/../foo",
	"/../../foo",
	"/foo/..",
	"foo//bar",
	"foo///bar",
	"//foo/bar",
	"foo/bar/",
	"/foo/bar/",
	"./",
	"../",
	"/.",
	"/..",
	"foo\0bar",
	"\0foo",
	"foo\0",
] as const;

type ValidPath = typeof validPaths[number];
type InvalidPath = typeof invalidPaths[number];

describe("is", () => {
	type _CheckValidPaths = DCommon.ExpectType<
		{ [Path in ValidPath]: DPath.IsLiteralPath<Path> },
		Record<ValidPath, true>,
		"strict"
	>;

	type _CheckInvalidPaths = DCommon.ExpectType<
		{ [Path in InvalidPath]: DPath.IsLiteralPath<Path> },
		Record<InvalidPath, false>,
		"strict"
	>;

	it.each(validPaths)("validates posix path %j", (value) => {
		expect(DPath.is(value)).toBe(true);
	});

	it.each(invalidPaths)("rejects invalid posix path %j", (value) => {
		expect(DPath.is(value)).toBe(false);
	});

	describe("at the literal split limit", () => {
		const tenSegments = "a/a/a/a/a/a/a/a/a/a/";
		const fiftySegments = DString.join([tenSegments, tenSegments, tenSegments, tenSegments, tenSegments] as const, "");
		const prefix = DString.join([fiftySegments, fiftySegments, fiftySegments, fiftySegments, fiftySegments] as const, "");

		it("agrees with the type on a valid path with 250 separators", () => {
			const value = `${prefix}a` as const;

			expect(DPath.is(value)).toBe(true satisfies DPath.IsLiteralPath<typeof value>);
		});

		it.each([
			{
				name: "a final dot segment at 250 separators",
				tail: ".",
				expected: true satisfies DPath.IsLiteralPath<`${typeof prefix}.`>,
			},
			{
				name: "a final parent segment at 250 separators",
				tail: "..",
				expected: true satisfies DPath.IsLiteralPath<`${typeof prefix}..`>,
			},
			{
				name: "a final null character at 250 separators",
				tail: "\0",
				expected: true satisfies DPath.IsLiteralPath<`${typeof prefix}\0`>,
			},
			{
				name: "only valid segments at 251 separators",
				tail: "a/a",
				expected: false satisfies DPath.IsLiteralPath<`${typeof prefix}a/a`>,
			},
		])("agrees with the type with $name", ({ tail, expected }) => {
			expect(DPath.is(`${prefix}${tail}`)).toBe(expected);
		});
	});

	it("narrows literal and constrained paths", () => {
		const literalPath = "/" as ValidPath | InvalidPath | (string & DPath.Path) | (string & DPath.Absolute);

		if (DPath.is(literalPath)) {
			type _Check = DCommon.ExpectType<
				typeof literalPath,
				ValidPath | (string & DPath.Path) | (string & DPath.Absolute),
				"strict"
			>;
		} else {
			type _Check = DCommon.ExpectType<
				typeof literalPath,
				InvalidPath,
				"strict"
			>;
		}
	});

	it("narrows a string to a constrained path", () => {
		const value = "test" as string;

		if (DPath.is(value)) {
			type _Check = DCommon.ExpectType<
				typeof value,
				string & DPath.Path,
				"strict"
			>;
		} else {
			type _Check = DCommon.ExpectType<
				typeof value,
				string,
				"strict"
			>;
		}
	});
});
