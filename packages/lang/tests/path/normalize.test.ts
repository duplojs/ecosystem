import type * as DCommon from "@scripts/common";
import * as DPath from "@scripts/path";

describe("normalize", () => {
	it.each([
		["", "."],
		[".", "."],
		["./", "."],
		["./.", "."],

		["foo", "foo"],
		["./foo", "foo"],
		["foo/", "foo"],
		["foo//bar", "foo/bar"],
		["foo///bar///", "foo/bar"],
		["foo/./bar", "foo/bar"],
		["./foo/./bar/", "foo/bar"],

		["..", ".."],
		["../..", "../.."],
		["../../foo", "../../foo"],
		[".././../foo", "../../foo"],

		["foo/..", "."],
		["foo/bar/..", "foo"],
		["foo/bar/../..", "."],
		["foo/../bar", "bar"],
		["foo/../../bar", "../bar"],
		["foo/bar/../../../baz", "../baz"],

		["/", "/"],
		["//", "/"],
		["///", "/"],
		["/.", "/"],
		["/./", "/"],

		["/foo", "/foo"],
		["//foo", "/foo"],
		["/foo/", "/foo"],
		["/foo//bar", "/foo/bar"],
		["/foo/./bar", "/foo/bar"],

		["/foo/..", "/"],
		["/foo/bar/..", "/foo"],
		["/foo/bar/../..", "/"],
		["/foo/../bar", "/bar"],

		["/..", "/"],
		["/../..", "/"],
		["/../../foo", "/foo"],
		["/foo/../../bar", "/bar"],

		["foo bar/baz", "foo bar/baz"],
		["dossier/été/élément", "dossier/été/élément"],
		[".git/config", ".git/config"],
		["src/index.ts", "src/index.ts"],
		["..foo/bar", "..foo/bar"],

		["file:///", "/"],
		["file:///foo/bar", "/foo/bar"],
		["file:/foo/bar", "/foo/bar"],
		["FILE:///foo/bar", "/foo/bar"],
		["file://localhost/foo/bar", "/foo/bar"],
		["file:///foo//bar/../baz/", "/foo/baz"],
		["file:///../../foo", "/foo"],
		["file:///foo%20bar/%C3%A9t%C3%A9/%23%25.ts", "/foo bar/été/#%.ts"],
		["file:///foo/bar?query=ignored#fragment", "/foo/bar"],
		["file:///foo/%2e%2e/bar", "/bar"],
		["file:///foo/%252F.ts", "/foo/%2F.ts"],
		["foo%20bar/%23.ts", "foo%20bar/%23.ts"],
	] as const)(
		"normalizes %j to %j",
		(path, expected) => {
			const result = DPath.normalize(path);

			expect(result).toBe(expected);
			expect(result).not.toBeNull();
			expect(DPath.is(result as string)).toBe(true);
		},
	);

	it.each([
		"file:///foo\0bar",
		"file:///foo%00bar",
		"file:///foo%2Fbar",
		"file:///foo%2fbar",
		"file:///foo%",
		"file:///foo%GG",
		"file:///foo%C3",
		"file://remote-host/foo/bar",
		"file://user@localhost/foo",
		"file://localhost:80/foo",
	])("returns null for an invalid file URL: %j", (path) => {
		expect(DPath.normalize(path)).toBeNull();
	});

	it.each([
		["foo\0bar"],
		["\0foo"],
		["foo\0"],
		["/\0"],
		["../\0/foo"],
	] as const)(
		"returns null for paths containing a null character: %j",
		(path) => {
			expect(DPath.normalize(path)).toBeNull();
		},
	);

	it("returns a valid path type", () => {
		const path = "foo/../bar" as string;

		const result = DPath.normalize(path);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});

	it("returns an absolute path when normalizing an absolute path", () => {
		const result = DPath.normalize("/foo/../bar");

		expect(result).toBe("/bar");

		if (result !== null) {
			expect(DPath.isAbsolute(result)).toBe(true);
		}
	});

	it("never keeps parent traversal above the absolute root", () => {
		expect(
			DPath.normalize("/../../../../foo"),
		).toBe("/foo");
	});

	it("keeps unresolved parent traversal for relative paths", () => {
		expect(
			DPath.normalize("foo/../../../bar"),
		).toBe("../../bar");
	});

	it("normalizes a relative path resolving to the current folder", () => {
		expect(
			DPath.normalize("foo/bar/../.."),
		).toBe(".");
	});
});
