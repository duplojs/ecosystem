import { type AnyTuple, DCommon, DPath, type ExpectType } from "@scripts";

describe("resolveFrom", () => {
	it.each<[string & DPath.Absolute, AnyTuple<string & DPath.Path>, string & DPath.Path]>([
		[DCommon.infer("/"), [DCommon.infer(".")], DCommon.infer("/")],
		[DCommon.infer("/"), [DCommon.infer("foo")], DCommon.infer("/foo")],
		[DCommon.infer("/"), [DCommon.infer("foo"), DCommon.infer("bar")], DCommon.infer("/foo/bar")],

		[DCommon.infer("/alpha"), [DCommon.infer(".")], DCommon.infer("/alpha")],
		[DCommon.infer("/alpha"), [DCommon.infer("beta")], DCommon.infer("/alpha/beta")],
		[DCommon.infer("/alpha"), [DCommon.infer("beta/gamma")], DCommon.infer("/alpha/beta/gamma")],

		[DCommon.infer("/alpha/beta"), [DCommon.infer("..")], DCommon.infer("/alpha")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("../gamma")], DCommon.infer("/alpha/gamma")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("../..")], DCommon.infer("/")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("../../gamma")], DCommon.infer("/gamma")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("../../../gamma")], DCommon.infer("/gamma")],

		[DCommon.infer("/alpha/beta"), [DCommon.infer("gamma"), DCommon.infer("..")], DCommon.infer("/alpha/beta")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("gamma"), DCommon.infer("../delta")], DCommon.infer("/alpha/beta/delta")],

		[DCommon.infer("/alpha/beta"), [DCommon.infer("/gamma")], DCommon.infer("/gamma")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("/gamma"), DCommon.infer("delta")], DCommon.infer("/gamma/delta")],
		[DCommon.infer("/alpha/beta"), [DCommon.infer("gamma"), DCommon.infer("/delta")], DCommon.infer("/delta")],

		[DCommon.infer("/alpha"), [DCommon.infer("foo bar")], DCommon.infer("/alpha/foo bar")],
		[DCommon.infer("/alpha"), [DCommon.infer(".git/config")], DCommon.infer("/alpha/.git/config")],
		[DCommon.infer("/alpha"), [DCommon.infer("dossier/été")], DCommon.infer("/alpha/dossier/été")],
		[DCommon.infer("/alpha"), [DCommon.infer("..foo")], DCommon.infer("/alpha/..foo")],
	] as const)(
		"resolves from %s with %j to %s",
		(origin, segments, expected) => {
			const result = DPath.resolveFrom(
				origin,
				segments,
			);

			expect(result).toBe(expected);

			if (result !== null) {
				expect(DPath.isAbsolute(result)).toBe(true);
			}
		},
	);

	describe("stayInOrigin", () => {
		it.each<[AnyTuple<string & DPath.Path>, string & DPath.Path]>([
			[[DCommon.infer(".")], DCommon.infer("/origin")],
			[[DCommon.infer("foo")], DCommon.infer("/origin/foo")],
			[[DCommon.infer("foo/bar")], DCommon.infer("/origin/foo/bar")],
			[[DCommon.infer("foo"), DCommon.infer("..")], DCommon.infer("/origin")],
			[[DCommon.infer("foo"), DCommon.infer("../bar")], DCommon.infer("/origin/bar")],
			[[DCommon.infer("..foo")], DCommon.infer("/origin/..foo")],
			[[DCommon.infer("..config/foo")], DCommon.infer("/origin/..config/foo")],
		] as const)(
			"allows %j to stay inside the origin",
			(segments, expected) => {
				const origin: string & DPath.Absolute = DCommon.infer("/origin");

				expect(
					DPath.resolveFrom(
						origin,
						segments,
						{ stayInOrigin: true },
					),
				).toBe(expected);
			},
		);

		it.each<[AnyTuple<string & DPath.Path>]>([
			[[DCommon.infer("..")]],
			[[DCommon.infer("../foo")]],
			[[DCommon.infer("../..")]],
			[[DCommon.infer("../../foo")]],
			[[DCommon.infer("/foo")]],
			[[DCommon.infer("/foo/bar")]],
			[[DCommon.infer("foo"), DCommon.infer("/bar")]],
		] as const)(
			"rejects %j when it escapes or replaces the origin",
			(segments) => {
				const origin: string & DPath.Absolute = DCommon.infer("/origin");

				expect(
					DPath.resolveFrom(
						origin,
						segments,
						{ stayInOrigin: true },
					),
				).toBeNull();
			},
		);

		it("checks the resolved relative path rather than individual segments", () => {
			const origin: string & DPath.Absolute = DCommon.infer("/origin");
			const result = DPath.resolveFrom(
				origin,
				[
					DCommon.infer("foo"),
					DCommon.infer(".."),
					DCommon.infer("bar"),
				],
				{ stayInOrigin: true },
			);

			expect(result).toBe("/origin/bar");

			type _CheckResult = ExpectType<
				typeof result,
				(string & DPath.Absolute) | null,
				"strict"
			>;
		});
	});

	it("returns an absolute path type", () => {
		const origin: string & DPath.Absolute = DCommon.infer("/alpha");

		const result = DPath.resolveFrom(origin, [
			DCommon.infer("beta"),
			DCommon.infer("gamma"),
		]);

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Absolute),
			"strict"
		>;
	});

	it("does not include null when origin confinement is disabled", () => {
		const result1 = DPath.resolveFrom(
			DCommon.infer("/alpha"),
			[DCommon.infer("beta")],
			{},
		);

		type _CheckResult1 = ExpectType<
			typeof result1,
			string & DPath.Absolute,
			"strict"
		>;

		const result2 = DPath.resolveFrom(
			DCommon.infer("/alpha"),
			[DCommon.infer("beta")],
			{ stayInOrigin: false },
		);

		type _CheckResult2 = ExpectType<
			typeof result2,
			string & DPath.Absolute,
			"strict"
		>;
	});

	it("requires an absolute origin", () => {
		const origin: string & DPath.Path = DCommon.infer("alpha");

		// @ts-expect-error origin must be absolute.
		DPath.resolveFrom(origin, [DCommon.infer("beta")]);
	});

	it("requires validated path segments", () => {
		const origin: string & DPath.Absolute = DCommon.infer("/alpha");
		const segments = ["beta"] as readonly string[];

		// @ts-expect-error segments must be validated paths.
		DPath.resolveFrom(origin, segments);
	});
});
