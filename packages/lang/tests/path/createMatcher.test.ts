import type { ExpectType } from "@scripts/common";
import * as DPath from "@scripts/path";

describe("createMatcher", () => {
	it("returns a path matcher constrained by Path", () => {
		const matcher = DPath.createMatcher("*.ts");

		type _CheckMatcher = ExpectType<
			typeof matcher,
			DPath.PathMatcher,
			"strict"
		>;

		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(true);

		// @ts-expect-error matcher input must be validated as a Path.
		matcher("index.ts");
	});

	it.each([
		{
			pattern: "",
			path: "index.ts",
			expected: false,
		},
		{
			pattern: "# comment",
			path: "# comment",
			expected: false,
		},
		{
			pattern: ["**", "!"],
			path: "index.ts",
			expected: true,
		},
		{
			pattern: "/",
			path: "/",
			expected: false,
		},
		{
			pattern: "unfinished\\",
			path: "unfinished",
			expected: false,
		},
	])("ignores the pattern $pattern for $path", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "index.ts\npackage.json",
			expected: true,
		},
		{
			path: "index.ts",
			expected: false,
		},
	])("treats a string as one pattern for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher("*.ts\n*.json");

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "README.md",
			expected: true,
		},
		{
			path: "docs/README.md",
			expected: true,
		},
		{
			path: "src/index.ts",
			expected: true,
		},
		{
			path: "/src/index.ts",
			expected: true,
		},
		{
			path: "app/src/index.ts",
			expected: false,
		},
		{
			path: "src/index.tsx",
			expected: false,
		},
	])("matches literal paths and components for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"README.md",
			"src/index.ts",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "index.unit",
			expected: true,
		},
		{
			path: "nested/index.unit",
			expected: true,
		},
		{
			path: "/nested/index.unit",
			expected: true,
		},
		{
			path: "file1.json",
			expected: true,
		},
		{
			path: "file10.json",
			expected: false,
		},
		{
			path: "src/user.spec.ts",
			expected: true,
		},
		{
			path: "src/unit/user.spec.ts",
			expected: false,
		},
	])("supports wildcards inside path segments for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"*.unit",
			"file?.json",
			"src/*.spec.ts",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			pattern: "**/",
			path: ".",
			expected: true,
		},
		{
			pattern: "**/",
			path: "index.ts",
			expected: true,
		},
		{
			pattern: "**/",
			path: "packages/lang/index.ts",
			expected: true,
		},
		{
			pattern: "/**",
			path: "/index.ts",
			expected: true,
		},
		{
			pattern: "src/**/file.ts",
			path: "src/file.ts",
			expected: true,
		},
		{
			pattern: "src/**/file.ts",
			path: "src/deep/nested/file.ts",
			expected: true,
		},
		{
			pattern: "src/**",
			path: "src",
			expected: false,
		},
		{
			pattern: "src/**",
			path: "src/index.ts",
			expected: true,
		},
		{
			pattern: "src/**",
			path: "src/deep/index.ts",
			expected: true,
		},
		{
			pattern: "assets/**/",
			path: "assets",
			expected: true,
		},
		{
			pattern: "assets/**/",
			path: "assets/logo.svg",
			expected: true,
		},
		{
			pattern: "assets/**/",
			path: "assets/deep/logo.svg",
			expected: true,
		},
	])("supports globstars in $pattern against $path", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "ignored/file.ts",
			expected: true,
		},
		{
			path: "ignored/public/file.ts",
			expected: false,
		},
	])("applies the last matching globstar rule for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"ignored/**",
			"!ignored/public/**",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			pattern: "***",
			path: "name",
			expected: true,
		},
		{
			pattern: "***",
			path: "nested/name",
			expected: true,
		},
		{
			pattern: "a***b",
			path: "aXYZb",
			expected: true,
		},
		{
			pattern: "a***b",
			path: "XYZb",
			expected: false,
		},
		{
			pattern: "a***b",
			path: "aXYZ",
			expected: false,
		},
	])("treats triple stars as ordinary wildcards in $pattern against $path", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "a/b",
			expected: false,
		},
		{
			path: "a/deep/b",
			expected: true,
		},
		{
			path: "a/deep/nested/b",
			expected: false,
		},
	])("treats only segment-level double stars as globstars for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher("a/***/b");

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "file4.txt",
			expected: true,
		},
		{
			path: "filex.txt",
			expected: false,
		},
		{
			path: "letterA.txt",
			expected: true,
		},
		{
			path: "letter1.txt",
			expected: false,
		},
		{
			path: "not-c.txt",
			expected: true,
		},
		{
			path: "not-a.txt",
			expected: false,
		},
		{
			path: "literal-].txt",
			expected: true,
		},
		{
			path: "escaped].txt",
			expected: true,
		},
		{
			path: "punct!.txt",
			expected: true,
		},
		{
			path: "punct/.txt",
			expected: false,
		},
		{
			path: "range..txt",
			expected: true,
		},
		{
			path: "range/.txt",
			expected: false,
		},
	])("supports character classes and POSIX classes for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"file[0-9].txt",
			"letter[[:alpha:]].txt",
			"not-[!ab].txt",
			"literal-[]].txt",
			"escaped[\\]].txt",
			"punct[[:punct:]].txt",
			"range[.-0].txt",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "bad[abc",
			expected: true,
		},
		{
			path: "range[z-a].txt",
			expected: true,
		},
		{
			path: "rangez.txt",
			expected: false,
		},
		{
			path: "unknown[].txt",
			expected: true,
		},
		{
			path: "missing[.txt",
			expected: true,
		},
		{
			path: "literal-class[].txt",
			expected: true,
		},
	])("treats malformed character classes as literal brackets for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"bad[abc",
			"range[z-a].txt",
			"unknown[[:custom:]].txt",
			"missing[[:custom].txt",
			"literal-class[a[]].txt",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "#hash.txt",
			expected: true,
		},
		{
			path: "!important.txt",
			expected: true,
		},
		{
			path: "literal*.txt",
			expected: true,
		},
		{
			path: "literal-file.txt",
			expected: false,
		},
		{
			path: "space ",
			expected: true,
		},
		{
			path: "space",
			expected: false,
		},
		{
			path: "trimmed",
			expected: true,
		},
	])("supports escaped special characters for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"\\#hash.txt",
			"\\!important.txt",
			"literal\\*.txt",
			"space\\ ",
			"trimmed ",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "root.txt",
			expected: false,
		},
		{
			path: "/root.txt",
			expected: true,
		},
		{
			path: "src/root.txt",
			expected: false,
		},
		{
			path: "nested/file.txt",
			expected: true,
		},
		{
			path: "/nested/file.txt",
			expected: true,
		},
		{
			path: "src/nested/file.txt",
			expected: false,
		},
		{
			path: "src/component.txt",
			expected: true,
		},
		{
			path: "/src/component.txt",
			expected: true,
		},
	])("supports anchored and unanchored patterns for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"/root.txt",
			"nested/file.txt",
			"component.txt",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "build",
			expected: true,
		},
		{
			path: "build/index.js",
			expected: true,
		},
		{
			path: "src/build/index.js",
			expected: true,
		},
		{
			path: "cache",
			expected: false,
		},
		{
			path: "cache/file",
			expected: false,
		},
		{
			path: "/cache",
			expected: true,
		},
		{
			path: "/cache/file",
			expected: true,
		},
		{
			path: "src/cache/file",
			expected: false,
		},
	])("matches directory patterns without requiring a directory input for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"build/",
			"/cache/",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "index.ts",
			expected: true,
		},
		{
			path: "other.ts",
			expected: true,
		},
	])("applies the last matching rule for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"*.ts",
			"!index.ts",
			"index.ts",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "dist",
			expected: true,
		},
		{
			path: "dist/app.js",
			expected: true,
		},
		{
			path: "dist/index.js",
			expected: false,
		},
		{
			path: "dist/index.js/map",
			expected: false,
		},
		{
			path: "dist/public",
			expected: false,
		},
		{
			path: "dist/public/logo.svg",
			expected: false,
		},
		{
			path: "dist/public/private",
			expected: true,
		},
		{
			path: "dist/public/private/key.txt",
			expected: true,
		},
	])("supports negative rules and reinclusions for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"dist/",
			"!dist/index.js",
			"!dist/public/",
			"dist/public/private/",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			pattern: ".",
			path: ".",
			expected: true,
		},
		{
			pattern: "..",
			path: "..",
			expected: true,
		},
		{
			pattern: "..",
			path: "../../index.ts",
			expected: true,
		},
		{
			pattern: "../*.ts",
			path: "../index.ts",
			expected: true,
		},
		{
			pattern: "../*.ts",
			path: "../../index.ts",
			expected: false,
		},
	])("matches canonical Path values with $pattern against $path", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "file+(1).ts",
			expected: true,
		},
		{
			path: "fileA1.ts",
			expected: false,
		},
		{
			path: "folder/{name}/item$",
			expected: true,
		},
	])("matches regex special characters literally for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"file+(1).ts",
			"folder/{name}/item$",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "other.ts",
			expected: true,
		},
		{
			path: "index.ts",
			expected: false,
		},
	])("keeps regex results stable across matcher calls for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"*.ts",
			"!index.ts",
		]);

		const firstResult = matcher(DPath.createOrThrow(path));
		const secondResult = matcher(DPath.createOrThrow(path));

		expect(firstResult).toBe(expected);
		expect(secondResult).toBe(expected);
	});

	const longPath = `${Array.from({ length: 80 }, (_value, index) => `segment-${index}`).join("/")}/target-file.ts`;

	it.each([
		{
			path: `src/${longPath}`,
			expected: true,
		},
		{
			path: `app/${longPath}`,
			expected: false,
		},
	])("matches long paths ($expected)", ({ path, expected }) => {
		const matcher = DPath.createMatcher("src/**/target-*.ts");

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			pattern: "./foo",
			path: "./foo",
			expected: true,
		},
		{
			pattern: "./src/foo.ts",
			path: "src/foo.ts",
			expected: true,
		},
		{
			pattern: "./foo/",
			path: "foo/bar",
			expected: true,
		},
		{
			pattern: "./",
			path: ".",
			expected: true,
		},
		{
			pattern: "./foo",
			path: "nested/foo",
			expected: false,
		},
		{
			pattern: "./foo",
			path: "../foo",
			expected: false,
		},
		{
			pattern: "./foo",
			path: "/foo",
			expected: false,
		},
		{
			pattern: "./src",
			path: "/bin/theme/src",
			expected: false,
		},
		{
			pattern: "./",
			path: "/",
			expected: false,
		},
		{
			pattern: "./",
			path: "foo",
			expected: false,
		},
		{
			pattern: "./*",
			path: "/foo",
			expected: false,
		},
		{
			pattern: "./**",
			path: ".",
			expected: true,
		},
		{
			pattern: "./**",
			path: "/foo",
			expected: false,
		},
		{
			pattern: "./src/**/file?.ts",
			path: "src/deep/file1.ts",
			expected: true,
		},
		{
			pattern: "./src/**/",
			path: "src",
			expected: true,
		},
		{
			pattern: "./src/**/",
			path: "/src",
			expected: false,
		},
		{
			pattern: "./../*.ts",
			path: "../index.ts",
			expected: true,
		},
		{
			pattern: "./../*.ts",
			path: "../../index.ts",
			expected: false,
		},
	])("matches a pattern prefixed with ./ ($pattern against $path)", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			pattern: "/**",
			path: ".",
			expected: false,
		},
		{
			pattern: "/**",
			path: "index.ts",
			expected: false,
		},
		{
			pattern: "/**",
			path: "/",
			expected: true,
		},
		{
			pattern: "/*.ts",
			path: "/index.ts",
			expected: true,
		},
		{
			pattern: "/*.ts",
			path: "index.ts",
			expected: false,
		},
		{
			pattern: "/src/**/",
			path: "/src",
			expected: true,
		},
		{
			pattern: "/src/**/",
			path: "src",
			expected: false,
		},
		{
			pattern: "/src/**/file?.ts",
			path: "/src/deep/file1.ts",
			expected: true,
		},
		{
			pattern: "/src/**/file?.ts",
			path: "/nested/src/file1.ts",
			expected: false,
		},
	])("requires an absolute path for $pattern against $path", ({ pattern, path, expected }) => {
		const matcher = DPath.createMatcher(pattern);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});

	it.each([
		{
			path: "src/draft.ts",
			expected: false,
		},
		{
			path: "/src/draft.ts",
			expected: true,
		},
		{
			path: "src/public/index.ts",
			expected: true,
		},
		{
			path: "/src/private/key.ts",
			expected: false,
		},
		{
			path: "/src/private/public/index.ts",
			expected: true,
		},
		{
			path: "src/private/public/index.ts",
			expected: false,
		},
	])("preserves path references in exclusions and reinclusions for $path", ({ path, expected }) => {
		const matcher = DPath.createMatcher([
			"**",
			"!./src/**",
			"!/src/private/**",
			"./src/public/**",
			"/src/private/public/**",
		]);

		const result = matcher(DPath.createOrThrow(path));
		expect(result).toBe(expected);
	});
});
