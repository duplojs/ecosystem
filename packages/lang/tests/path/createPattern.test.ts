import { DPath, type ExpectType } from "@scripts";

describe("createPattern", () => {
	it("returns a path matcher constrained by Path", () => {
		const matcher = DPath.createPattern("*.ts");

		type _CheckMatcher = ExpectType<
			typeof matcher,
			DPath.PathMatcher,
			"strict"
		>;

		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(true);

		// @ts-expect-error matcher input must be validated as a Path.
		matcher("index.ts");
	});

	it("keeps patterns as plain strings", () => {
		const literalPattern = "*.ts" as const;
		const broadPattern = "*.json" as string;

		expect(DPath.createPattern(literalPattern)(DPath.createOrThrow("index.ts"))).toBe(true);
		expect(DPath.createPattern(broadPattern)(DPath.createOrThrow("package.json"))).toBe(true);
	});

	it("ignores empty patterns and comments", () => {
		const matcher = DPath.createPattern([
			"",
			"# comment",
			"!",
			"/",
			"unfinished\\",
			"*.ts",
		]);

		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("# comment"))).toBe(false);
	});

	it("treats a string as a single pattern", () => {
		const matcher = DPath.createPattern("*.ts\n*.json");

		expect(matcher(DPath.createOrThrow("index.ts\npackage.json"))).toBe(true);
		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("style.css"))).toBe(false);
	});

	it("matches literal paths and path components", () => {
		const matcher = DPath.createPattern([
			"README.md",
			"src/index.ts",
		]);

		expect(matcher(DPath.createOrThrow("README.md"))).toBe(true);
		expect(matcher(DPath.createOrThrow("docs/README.md"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("app/src/index.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("src/index.tsx"))).toBe(false);
	});

	it("supports wildcards inside path segments", () => {
		const matcher = DPath.createPattern([
			"*.unit",
			"file?.json",
			"src/*.spec.ts",
		]);

		expect(matcher(DPath.createOrThrow("index.unit"))).toBe(true);
		expect(matcher(DPath.createOrThrow("nested/index.unit"))).toBe(true);
		expect(matcher(DPath.createOrThrow("file1.json"))).toBe(true);
		expect(matcher(DPath.createOrThrow("file10.json"))).toBe(false);
		expect(matcher(DPath.createOrThrow("src/user.spec.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/unit/user.spec.ts"))).toBe(false);
	});

	it("supports globstars at different positions", () => {
		const matcher = DPath.createPattern([
			"**/",
			"/**",
			"!/private/**",
			"src/**/file.ts",
			"src/**",
			"!src/**/draft.ts",
			"assets/**/",
		]);

		expect(matcher(DPath.createOrThrow("."))).toBe(true);
		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("packages/lang/index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/private/token.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("src/file.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/deep/nested/file.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/deep/index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/draft.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("src/deep/draft.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("assets"))).toBe(true);
		expect(matcher(DPath.createOrThrow("assets/logo.svg"))).toBe(true);
		expect(matcher(DPath.createOrThrow("assets/deep/logo.svg"))).toBe(true);
	});

	it("lets globstar negatives reinclude descendants according to the last rule", () => {
		const matcher = DPath.createPattern([
			"ignored/**",
			"!ignored/public/**",
		]);

		expect(matcher(DPath.createOrThrow("ignored/file.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("ignored/public/file.ts"))).toBe(false);
	});

	it("treats only segment-level double stars as globstars", () => {
		const segmentMatcher = DPath.createPattern([
			"***",
			"a***b",
		]);
		const pathMatcher = DPath.createPattern("a/***/b");

		expect(segmentMatcher(DPath.createOrThrow("name"))).toBe(true);
		expect(segmentMatcher(DPath.createOrThrow("nested/name"))).toBe(true);
		expect(segmentMatcher(DPath.createOrThrow("aXYZb"))).toBe(true);
		expect(pathMatcher(DPath.createOrThrow("a/b"))).toBe(false);
		expect(pathMatcher(DPath.createOrThrow("a/deep/b"))).toBe(true);
		expect(pathMatcher(DPath.createOrThrow("a/deep/nested/b"))).toBe(false);
	});

	it("supports character classes and POSIX classes without crossing separators", () => {
		const matcher = DPath.createPattern([
			"file[0-9].txt",
			"letter[[:alpha:]].txt",
			"not-[!ab].txt",
			"literal-[]].txt",
			"closing[]]bracket.txt",
			"escaped[\\]].txt",
			"punct[[:punct:]].txt",
			"range[.-0].txt",
		]);

		expect(matcher(DPath.createOrThrow("file4.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("filex.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("letterA.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("letter1.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("not-c.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("not-a.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("literal-].txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("closing]bracket.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("escaped].txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("punct!.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("punct/.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("range..txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("range/.txt"))).toBe(false);
	});

	it("treats malformed character classes as literal opening brackets", () => {
		const matcher = DPath.createPattern([
			"bad[abc",
			"range[z-a].txt",
			"unknown[[:custom:]].txt",
			"missing[[:custom].txt",
			"literal-class[a[]].txt",
		]);

		expect(matcher(DPath.createOrThrow("bad[abc"))).toBe(true);
		expect(matcher(DPath.createOrThrow("range[z-a].txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("rangez.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("unknown[].txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("missing[.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("literal-class[].txt"))).toBe(true);
	});

	it("supports escaped special characters", () => {
		const matcher = DPath.createPattern([
			"\\#hash.txt",
			"\\!important.txt",
			"literal\\*.txt",
			"space\\ ",
			"trimmed ",
		]);

		expect(matcher(DPath.createOrThrow("#hash.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("!important.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("literal*.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("literal-file.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("space "))).toBe(true);
		expect(matcher(DPath.createOrThrow("space"))).toBe(false);
		expect(matcher(DPath.createOrThrow("trimmed"))).toBe(true);
	});

	it("supports anchored and unanchored patterns", () => {
		const matcher = DPath.createPattern([
			"/root.txt",
			"nested/file.txt",
			"component.txt",
		]);

		expect(matcher(DPath.createOrThrow("root.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/root.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/root.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("nested/file.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/nested/file.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/nested/file.txt"))).toBe(false);
		expect(matcher(DPath.createOrThrow("src/component.txt"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/src/component.txt"))).toBe(true);
	});

	it("matches directory syntax without requiring directory inputs", () => {
		const matcher = DPath.createPattern([
			"build/",
			"root-only/",
			"/cache/",
		]);

		expect(matcher(DPath.createOrThrow("build"))).toBe(true);
		expect(matcher(DPath.createOrThrow("build/index.js"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/build/index.js"))).toBe(true);
		expect(matcher(DPath.createOrThrow("cache"))).toBe(true);
		expect(matcher(DPath.createOrThrow("cache/file"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/cache"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/cache/file"))).toBe(true);
		expect(matcher(DPath.createOrThrow("src/cache/file"))).toBe(false);
		expect(matcher(DPath.createOrThrow("root-only"))).toBe(true);
		expect(matcher(DPath.createOrThrow("root-only/file"))).toBe(true);
	});

	it("applies the last matching rule", () => {
		const matcher = DPath.createPattern([
			"*.ts",
			"!index.ts",
			"index.ts",
		]);

		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("other.ts"))).toBe(true);
	});

	it("supports negative rules and reinclusions", () => {
		const matcher = DPath.createPattern([
			"dist/",
			"!dist/index.js",
			"!dist/public/",
			"dist/public/private/",
		]);

		expect(matcher(DPath.createOrThrow("dist"))).toBe(true);
		expect(matcher(DPath.createOrThrow("dist/app.js"))).toBe(true);
		expect(matcher(DPath.createOrThrow("dist/index.js"))).toBe(false);
		expect(matcher(DPath.createOrThrow("dist/index.js/map"))).toBe(false);
		expect(matcher(DPath.createOrThrow("dist/public"))).toBe(false);
		expect(matcher(DPath.createOrThrow("dist/public/logo.svg"))).toBe(false);
		expect(matcher(DPath.createOrThrow("dist/public/private"))).toBe(true);
		expect(matcher(DPath.createOrThrow("dist/public/private/key.txt"))).toBe(true);
	});

	it("trusts canonical Path values supplied to the matcher", () => {
		const matcher = DPath.createPattern([
			".",
			"..",
			"../*.ts",
			"/root.txt",
		]);

		expect(matcher(DPath.createOrThrow("."))).toBe(true);
		expect(matcher(DPath.createOrThrow(".."))).toBe(true);
		expect(matcher(DPath.createOrThrow("../index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("../../index.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("/root.txt"))).toBe(true);
	});

	it("matches paths containing regex special characters literally", () => {
		const matcher = DPath.createPattern([
			"file+(1).ts",
			"folder/{name}/item$",
		]);

		expect(matcher(DPath.createOrThrow("file+(1).ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("fileA1.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("folder/{name}/item$"))).toBe(true);
	});

	it("keeps regex results stable across matcher calls", () => {
		const matcher = DPath.createPattern([
			"*.ts",
			"!index.ts",
		]);

		expect(matcher(DPath.createOrThrow("other.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(false);
		expect(matcher(DPath.createOrThrow("other.ts"))).toBe(true);
		expect(matcher(DPath.createOrThrow("index.ts"))).toBe(false);
	});

	it("matches long paths without excessive backtracking", () => {
		const matcher = DPath.createPattern("src/**/target-*.ts");
		const longPath = `${Array.from({ length: 80 }, (_value, index) => `segment-${index}`).join("/")}/target-file.ts`;

		expect(matcher(DPath.createOrThrow(`src/${longPath}`))).toBe(true);
		expect(matcher(DPath.createOrThrow(`app/${longPath}`))).toBe(false);
	});
});
