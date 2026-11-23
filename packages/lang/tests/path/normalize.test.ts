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
		["file:report", "file:report"],
		["file:tmp/fichier", "file:tmp/fichier"],
		["./file:report", "file:report"],
		["FILE:report", "FILE:report"],
		["file:/foo/bar", "file:/foo/bar"],
		["file:./tmp/fichier", "file:./tmp/fichier"],
		["FILE:./tmp/fichier", "FILE:./tmp/fichier"],
		["file:../tmp/fichier", "file:../tmp/fichier"],
		["file:.tmp/fichier", "file:.tmp/fichier"],
		["file:.env", "file:.env"],
		["file:.", "file:."],
		["./file:///foo/bar", "/foo/bar"],
		["/file:///foo/bar", "/foo/bar"],
		["./FILE:///foo%20bar", "/foo bar"],
		["./file://remote-host/foo/bar", "/remote-host/foo/bar"],
		["/file:///foo%2Fbar", "/foo/bar"],
		["a/file:///foo/bar", "a/file:/foo/bar"],
		["/a/file:///foo/bar", "/a/file:/foo/bar"],
		["file:report%20name", "file:report%20name"],

		["file:///", "/"],
		["file:///foo/bar", "/foo/bar"],
		["file:///C:/project/main.mjs", "/C:/project/main.mjs"],
		["FILE:///foo/bar", "/foo/bar"],
		["file://localhost/foo/bar", "/foo/bar"],
		["file://remote-host/foo/bar", "/remote-host/foo/bar"],
		["file://remote-host", "/remote-host"],
		["file://remote-host/", "/remote-host"],
		["file://REMOTE-HOST/foo/bar", "/remote-host/foo/bar"],
		["file://remote-host/foo%20bar/%C3%A9.txt", "/remote-host/foo bar/é.txt"],
		["file://remote-host/foo//bar/../baz/", "/remote-host/foo/baz"],
		["file://remote-host/foo/bar?query=ignored#fragment", "/remote-host/foo/bar"],
		["file:///foo//bar/../baz/", "/foo/baz"],
		["file:///../../foo", "/foo"],
		["file:///foo%20bar/%C3%A9t%C3%A9/%23%25.ts", "/foo bar/été/#%.ts"],
		["file:///foo/bar?query=ignored#fragment", "/foo/bar"],
		["file:///foo/%2e%2e/bar", "/bar"],
		["file:///foo/%252F.ts", "/foo/%2F.ts"],
		["file:///foo%2Fbar", "/foo/bar"],
		["file:///foo%2fbar", "/foo/bar"],
		["file:///tmp/a%2F..%2Fsecret", "/tmp/secret"],
		["foo%20bar/%23.ts", "foo%20bar/%23.ts"],
	] as const)(
		"normalizes %j to %j",
		(path, expected) => {
			const result = DPath.normalize(path);

			expect(result).toBe(expected);
			expect(result).not.toBeNull();
			expect(DPath.is(result as string)).toBe(true);
			expect(DPath.normalize(result!)).toBe(result);
		},
	);

	it("keeps relative names prefixed with file: stable", () => {
		const result = DPath.normalize("./file:tmp/fichier");

		expect(result).toBe("file:tmp/fichier");
		expect(DPath.normalize(result!)).toBe("file:tmp/fichier");
	});

	it.each([
		"file:/foo/bar",
		"file:./foo/bar",
		"/file:/foo/bar",
		"file:/foo%20bar",
		"file:/foo?query#fragment",
	])("preserves the already valid path %j", (path) => {
		expect(DPath.is(path)).toBe(true);
		expect(DPath.normalize(path)).toBe(path);
	});

	it("keeps a file-like path exposed by parent traversal stable", () => {
		const result = DPath.normalize("/a/../file:///foo/bar");

		expect(result).toBe("/file:/foo/bar");
		expect(DPath.normalize(result!)).toBe(result);
	});

	it.each([
		"file:///foo\0bar",
		"file:///foo%00bar",
		"file:///foo%",
		"file:///foo%GG",
		"file:///foo%C3",
		"file://remote-host/foo%00bar",
		"file://remote-host/foo%GG",
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
			DPath.AnyPath | null,
			"strict"
		>;
	});

	it("keeps normalized file URL hostnames stable", () => {
		const result = DPath.normalize("file://remote-host/foo%20bar/baz");

		expect(result).toBe("/remote-host/foo bar/baz");
		expect(DPath.isAbsolute(result!)).toBe(true);
		expect(DPath.normalize(result!)).toBe(result);
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
