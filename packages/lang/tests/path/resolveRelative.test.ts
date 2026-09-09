import { type AnyTuple, DCommon, DPath, type ExpectType } from "@scripts";

describe("resolveRelative", () => {
	it.each<[AnyTuple<string & DPath.Path>, string & DPath.Path]>([
		[[DCommon.infer(".")], DCommon.infer(".")],
		[[DCommon.infer("."), DCommon.infer(".")], DCommon.infer(".")],

		[[DCommon.infer("foo")], DCommon.infer("foo")],
		[[DCommon.infer("foo"), DCommon.infer("bar")], DCommon.infer("foo/bar")],
		[[DCommon.infer("foo"), DCommon.infer("bar"), DCommon.infer("baz")], DCommon.infer("foo/bar/baz")],
		[[DCommon.infer("foo/bar"), DCommon.infer("baz")], DCommon.infer("foo/bar/baz")],
		[[DCommon.infer("foo"), DCommon.infer("bar/baz")], DCommon.infer("foo/bar/baz")],

		[[DCommon.infer("..")], DCommon.infer("..")],
		[[DCommon.infer("../..")], DCommon.infer("../..")],
		[[DCommon.infer(".."), DCommon.infer("..")], DCommon.infer("../..")],
		[[DCommon.infer(".."), DCommon.infer("foo")], DCommon.infer("../foo")],
		[[DCommon.infer("../.."), DCommon.infer("foo")], DCommon.infer("../../foo")],
		[[DCommon.infer(".."), DCommon.infer("foo/bar")], DCommon.infer("../foo/bar")],

		[[DCommon.infer("foo"), DCommon.infer("..")], DCommon.infer(".")],
		[[DCommon.infer("foo/bar"), DCommon.infer("..")], DCommon.infer("foo")],
		[[DCommon.infer("foo/bar"), DCommon.infer("../..")], DCommon.infer(".")],
		[[DCommon.infer("foo"), DCommon.infer("../bar")], DCommon.infer("bar")],
		[[DCommon.infer("foo"), DCommon.infer("../../bar")], DCommon.infer("../bar")],
		[[DCommon.infer("foo/bar"), DCommon.infer("../../baz")], DCommon.infer("baz")],
		[[DCommon.infer("foo/bar"), DCommon.infer("../../../baz")], DCommon.infer("../baz")],

		[[DCommon.infer("foo"), DCommon.infer("."), DCommon.infer("bar")], DCommon.infer("foo/bar")],
		[[DCommon.infer("foo"), DCommon.infer(".."), DCommon.infer(".")], DCommon.infer(".")],
		[[DCommon.infer("."), DCommon.infer("foo"), DCommon.infer(".")], DCommon.infer("foo")],

		[[DCommon.infer("/")], DCommon.infer("/")],
		[[DCommon.infer("/"), DCommon.infer(".")], DCommon.infer("/")],
		[[DCommon.infer("/"), DCommon.infer("foo")], DCommon.infer("/foo")],
		[[DCommon.infer("/"), DCommon.infer("foo"), DCommon.infer("bar")], DCommon.infer("/foo/bar")],
		[[DCommon.infer("/foo")], DCommon.infer("/foo")],
		[[DCommon.infer("/foo"), DCommon.infer("bar")], DCommon.infer("/foo/bar")],
		[[DCommon.infer("/foo/bar"), DCommon.infer("baz")], DCommon.infer("/foo/bar/baz")],

		[[DCommon.infer("/foo"), DCommon.infer("..")], DCommon.infer("/")],
		[[DCommon.infer("/foo/bar"), DCommon.infer("..")], DCommon.infer("/foo")],
		[[DCommon.infer("/foo/bar"), DCommon.infer("../..")], DCommon.infer("/")],
		[[DCommon.infer("/foo"), DCommon.infer("../bar")], DCommon.infer("/bar")],
		[[DCommon.infer("/foo"), DCommon.infer("../../bar")], DCommon.infer("/bar")],
		[[DCommon.infer("/"), DCommon.infer("..")], DCommon.infer("/")],
		[[DCommon.infer("/"), DCommon.infer("../..")], DCommon.infer("/")],

		[[DCommon.infer("foo"), DCommon.infer("/bar")], DCommon.infer("/bar")],
		[[DCommon.infer("foo/baz"), DCommon.infer("/bar")], DCommon.infer("/bar")],
		[[DCommon.infer(".."), DCommon.infer("/bar")], DCommon.infer("/bar")],
		[[DCommon.infer("/foo"), DCommon.infer("/bar")], DCommon.infer("/bar")],
		[[DCommon.infer("/foo"), DCommon.infer("bar"), DCommon.infer("/baz/qux")], DCommon.infer("/baz/qux")],
		[[DCommon.infer("/foo"), DCommon.infer(".."), DCommon.infer("/bar"), DCommon.infer("baz")], DCommon.infer("/bar/baz")],

		[[DCommon.infer("foo bar"), DCommon.infer("baz")], DCommon.infer("foo bar/baz")],
		[[DCommon.infer("dossier"), DCommon.infer("été"), DCommon.infer("élément")], DCommon.infer("dossier/été/élément")],
		[[DCommon.infer(".git"), DCommon.infer("config")], DCommon.infer(".git/config")],
		[[DCommon.infer("src"), DCommon.infer("index.ts")], DCommon.infer("src/index.ts")],
	])(
		"resolves %j to %s",
		(paths, expected) => {
			const result = DPath.resolveRelative(paths);

			expect(result).toBe(expected);
			expect(DPath.is(result)).toBe(true);
		},
	);

	it("returns an absolute path after encountering an absolute segment", () => {
		const result = DPath.resolveRelative([
			DCommon.infer("foo"),
			DCommon.infer("/bar"),
			DCommon.infer("baz"),
		]);

		expect(result).toBe("/bar/baz");
		expect(DPath.isAbsolute(result)).toBe(true);
	});

	it("preserves the absolute guarantee in its output type", () => {
		const result = DPath.resolveRelative([
			DCommon.infer("foo"),
			DCommon.infer("/bar") satisfies string & DPath.Absolute,
			DCommon.infer("baz"),
		]);

		type _CheckResult = ExpectType<
			typeof result,
			string & DPath.Path & DPath.Absolute,
			"strict"
		>;
	});

	it("resets the accumulated path when another absolute path is encountered", () => {
		expect(DPath.resolveRelative([
			DCommon.infer("/alpha/beta"),
			DCommon.infer("gamma"),
			DCommon.infer("/delta"),
			DCommon.infer("epsilon"),
		])).toBe("/delta/epsilon");
	});

	it("never traverses above the absolute root", () => {
		expect(DPath.resolveRelative([
			DCommon.infer("/alpha"),
			DCommon.infer("../../../../beta"),
		])).toBe("/beta");
	});

	it("keeps unresolved parent traversal for relative paths", () => {
		expect(DPath.resolveRelative([
			DCommon.infer("alpha"),
			DCommon.infer("../../../beta"),
		])).toBe("../../beta");
	});

	it("returns a valid path type", () => {
		const result = DPath.resolveRelative([
			DCommon.infer("alpha"),
			DCommon.infer("beta"),
			DCommon.infer(".."),
			DCommon.infer("gamma"),
		]);

		type _CheckResult = ExpectType<
			typeof result,
			string & DPath.Path,
			"strict"
		>;
	});

	it("requires validated paths", () => {
		const paths = [
			"alpha",
			"beta",
		] as readonly string[];

		// @ts-expect-error paths must be validated before resolution.
		DPath.resolveRelative(paths);
	});
});
