import { DCommon, DPath, type ExpectType } from "@scripts";

describe("isAbsolute", () => {
	it.each([
		"/foo/bar",
		"/foo",
		"/",
	])("validates absolute posix path %s", (value) => {
		expect(DPath.isAbsolute(value)).toBe(true);
	});

	it.each([
		"foo/bar",
		"foo",
		"../foo",
		"../../foo/bar",
		".",
		"..",
		"../..",
		"foo bar/baz",
		"foo-bar_42/@scope",
		"dossier/été/élément",
		".git/config",
		"src/index.ts",

		"",
		"./foo",
		"foo/./bar",
		"foo/.",
		"foo/../bar",
		"foo/..",
		"../foo/../bar",
		"/../foo",
		"/../../foo",
		"foo//bar",
		"foo///bar",
		"//foo/bar",
		"foo/bar/",
		"/foo/bar/",
		"foo\0bar",
		"\0foo",
		"foo\0",
	])("rejects non absolute posix path %s", (value) => {
		expect(DPath.isAbsolute(value)).toBe(false);
	});

	it("valid type", () => {
		const literalPath = "/" as (
			| "foo/bar"
			| "foo"
			| "../foo"
			| "../../foo/bar"
			| ".."
			| "../.."
			| "/foo/bar"
			| "/foo"
			| "/"
			| "foo bar/baz"
			| "foo-bar_42/@scope"
			| "dossier/été/élément"
			| ".git/config"
			| "src/index.ts"
			| (string & DPath.Path)
			| (string & DPath.Absolute)

			| ""
			| "."
			| "./foo"
			| "foo/./bar"
			| "foo/."
			| "foo/../bar"
			| "foo/.."
			| "../foo/../bar"
			| "/../foo"
			| "/../../foo"
			| "foo//bar"
			| "foo///bar"
			| "//foo/bar"
			| "foo/bar/"
			| "/foo/bar/"
			| "foo\0bar"
			| "\0foo"
			| "foo\0"
		);

		if (DPath.isAbsolute(literalPath)) {
			type check = ExpectType<
				typeof literalPath,
				| "/foo/bar"
				| "/foo"
				| "/"
				| (string & DPath.Absolute)
				| (string & DPath.Path & DPath.Absolute),
				"strict"
			>;
		} else {
			type check = ExpectType<
				typeof literalPath,
				| "foo/bar"
				| "foo"
				| "../foo"
				| "../../foo/bar"
				| ".."
				| "../.."
				| "foo bar/baz"
				| "foo-bar_42/@scope"
				| "dossier/été/élément"
				| ".git/config"
				| "src/index.ts"
				| (string & DPath.Path)
				| ""
				| "."
				| "./foo"
				| "foo/./bar"
				| "foo/."
				| "foo/../bar"
				| "foo/.."
				| "../foo/../bar"
				| "/../foo"
				| "/../../foo"
				| "foo//bar"
				| "foo///bar"
				| "//foo/bar"
				| "foo/bar/"
				| "/foo/bar/"
				| "foo\0bar"
				| "\0foo"
				| "foo\0",
				"strict"
			>;
		}

		const value = "test" as string;

		if (DPath.isAbsolute(value)) {
			type check = ExpectType<
				typeof value,
				string & DPath.Absolute,
				"strict"
			>;
		} else {
			type check = ExpectType<
				typeof value,
				string,
				"strict"
			>;
		}
	});
});
