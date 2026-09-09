import { DCommon, DPath, type ExpectType } from "@scripts";

describe("computeRelative", () => {
	it.each<[string & DPath.Absolute, string & DPath.Absolute, string & DPath.Path]>([
		[DCommon.infer("/"), DCommon.infer("/"), DCommon.infer(".")],

		[DCommon.infer("/"), DCommon.infer("/alpha"), DCommon.infer("alpha")],
		[DCommon.infer("/"), DCommon.infer("/alpha/beta"), DCommon.infer("alpha/beta")],

		[DCommon.infer("/alpha"), DCommon.infer("/"), DCommon.infer("..")],
		[DCommon.infer("/alpha/beta"), DCommon.infer("/"), DCommon.infer("../..")],
		[DCommon.infer("/alpha/beta/gamma"), DCommon.infer("/"), DCommon.infer("../../..")],

		[DCommon.infer("/alpha"), DCommon.infer("/alpha"), DCommon.infer(".")],
		[DCommon.infer("/alpha/beta"), DCommon.infer("/alpha/beta"), DCommon.infer(".")],

		[DCommon.infer("/alpha"), DCommon.infer("/alpha/beta"), DCommon.infer("beta")],
		[DCommon.infer("/alpha"), DCommon.infer("/alpha/beta/gamma"), DCommon.infer("beta/gamma")],
		[DCommon.infer("/alpha/beta"), DCommon.infer("/alpha/beta/gamma"), DCommon.infer("gamma")],

		[DCommon.infer("/alpha/beta"), DCommon.infer("/alpha"), DCommon.infer("..")],
		[DCommon.infer("/alpha/beta/gamma"), DCommon.infer("/alpha"), DCommon.infer("../..")],
		[DCommon.infer("/alpha/beta/gamma"), DCommon.infer("/alpha/beta"), DCommon.infer("..")],

		[DCommon.infer("/alpha/beta"), DCommon.infer("/alpha/gamma"), DCommon.infer("../gamma")],
		[DCommon.infer("/alpha/beta/gamma"), DCommon.infer("/alpha/delta"), DCommon.infer("../../delta")],
		[DCommon.infer("/alpha/beta"), DCommon.infer("/gamma/delta"), DCommon.infer("../../gamma/delta")],

		[DCommon.infer("/foo bar/baz"), DCommon.infer("/foo bar/qux"), DCommon.infer("../qux")],
		[DCommon.infer("/dossier/été"), DCommon.infer("/dossier/hiver"), DCommon.infer("../hiver")],
		[DCommon.infer("/.git/config"), DCommon.infer("/.git/hooks"), DCommon.infer("../hooks")],
		[DCommon.infer("/src/index.ts"), DCommon.infer("/src/utils.ts"), DCommon.infer("../utils.ts")],
	] as const)(
		"computes relative path from %s to %s",
		(source, destination, expected) => {
			expect(
				DPath.computeRelative(source, destination),
			).toBe(expected);
		},
	);

	it("returns a valid path", () => {
		const source: string & DPath.Absolute = DCommon.infer(
			"/alpha/beta/gamma",
		);
		const destination: string & DPath.Absolute = DCommon.infer(
			"/alpha/delta/epsilon",
		);

		const result = DPath.computeRelative(source, destination);

		expect(result).toBe("../../delta/epsilon");
		expect(DPath.is(result)).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			string & DPath.Path,
			"strict"
		>;
	});

	it("handles an absolute path typed as path and absolute", () => {
		const source: string & DPath.Path & DPath.Absolute = DCommon.infer(
			"/alpha/beta",
		);
		const destination: string & DPath.Path & DPath.Absolute = DCommon.infer(
			"/alpha/gamma",
		);

		const result = DPath.computeRelative(source, destination);

		expect(result).toBe("../gamma");

		type _CheckResult = ExpectType<
			typeof result,
			string & DPath.Path,
			"strict"
		>;
	});

	it("requires an absolute source path", () => {
		const source: string & DPath.Path = DCommon.infer("alpha/beta");
		const destination: string & DPath.Absolute = DCommon.infer("/alpha");

		// @ts-expect-error source must be absolute.
		DPath.computeRelative(source, destination);
	});

	it("requires an absolute destination path", () => {
		const source: string & DPath.Absolute = DCommon.infer("/alpha");
		const destination: string & DPath.Path = DCommon.infer("alpha/beta");

		// @ts-expect-error destination must be absolute.
		DPath.computeRelative(source, destination);
	});

	it("requires validated paths", () => {
		const source = "/alpha" as string;
		const destination = "/beta" as string;

		// @ts-expect-error source and destination must be validated absolute paths.
		DPath.computeRelative(source, destination);
	});
});
