import { DPath, type ExpectType } from "@scripts";

describe("is", () => {
	it.each([
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
	])("validates posix path %s", (value) => {
		expect(DPath.is(value)).toBe(true);
	});

	it.each([
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
	])("rejects invalid posix path %s", (value) => {
		expect(DPath.is(value)).toBe(false);
	});

	it("valid type", () => {
		const literalPath = "/" as (
			| "foo/bar"
			| "foo"
			| "../foo"
			| "../../foo/bar"
			| "."
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

		if (DPath.is(literalPath)) {
			type check = ExpectType<
				typeof literalPath,
				| "foo/bar"
				| "foo"
				| "../foo"
				| "../../foo/bar"
				| "."
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
				| (string & DPath.Absolute),
				"strict"
			>;
		} else {
			type check = ExpectType<
				typeof literalPath,
				| ""
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

		if (DPath.is(value)) {
			type check = ExpectType<
				typeof value,
				string & DPath.Path,
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
