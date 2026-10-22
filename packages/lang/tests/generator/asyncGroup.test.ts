import * as DGenerator from "@scripts/generator";
import * as DCommon from "@scripts/common";

describe("asyncGroup", () => {
	it("groups async iterable values by callback output", async() => {
		const input = (async function *() {
			yield await Promise.resolve("a" as const);
			yield await Promise.resolve("bb" as const);
			yield await Promise.resolve("c" as const);
		})();
		const result = DGenerator.asyncGroup(
			input,
			(item, params) => params.output(
				item.length === 1 ? "short" : "long",
				{
					item,
					index: params.index,
				},
			),
		);

		await expect(result).resolves.toEqual({
			short: [
				{
					item: "a",
					index: 0,
				},
				{
					item: "c",
					index: 2,
				},
			],
			long: [
				{
					item: "bb",
					index: 1,
				},
			],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{
				readonly long?: readonly [{
					item: "a" | "bb" | "c";
					index: number;
				}, ...{
					item: "a" | "bb" | "c";
					index: number;
				}[]] | undefined;
				readonly short?: readonly [{
					item: "a" | "bb" | "c";
					index: number;
				}, ...{
					item: "a" | "bb" | "c";
					index: number;
				}[]] | undefined;
			}>,
			"flexible"
		>;
	});

	it("groups async values in pipe", async() => {
		const result = DCommon.pipe(
			["alpha", "bee", "ace"] as const,
			DGenerator.asyncMap(async(item) => Promise.resolve(item)),
			DGenerator.asyncGroup((item, params) => params.output(
				item.startsWith("a") ? "startA" : "other",
				item,
			)),
		);

		await expect(result).resolves.toEqual({
			startA: ["alpha", "ace"],
			other: ["bee"],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{
				readonly startA?: readonly ["alpha" | "bee" | "ace", ...("alpha" | "bee" | "ace")[]] | undefined;
				readonly other?: readonly ["alpha" | "bee" | "ace", ...("alpha" | "bee" | "ace")[]] | undefined;
			}>,
			"strict"
		>;
	});

	it("returns an empty result for an empty async iterable", async() => {
		const result = await DGenerator.asyncGroup(
			(async function *() {
				await Promise.resolve();
				if (false) {
					yield undefined as never;
				}
			})(),
			(item, params) => params.output("missing", item),
		);

		expect(result).toEqual({});
		expect(Object.getPrototypeOf(result)).toBeNull();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				readonly missing?: readonly [never, ...never[]] | undefined;
			},
			"strict"
		>;
	});

	it("preserves item unions when grouping async iterable input", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
			yield await Promise.resolve("a" as 1 | "a");
		})();
		const result = DGenerator.asyncGroup(
			input,
			async(item, params) => {
				type _CheckItem = DCommon.ExpectType<
					typeof item,
					1 | "a",
					"strict"
				>;

				return Promise.resolve(params.output("value", item));
			},
		);

		await expect(result).resolves.toEqual({
			value: [1, "a"],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{
				readonly value?: readonly [1 | "a", ...(1 | "a")[]] | undefined;
			}>,
			"strict"
		>;
	});

	it.each(["toString", "constructor", "__proto__"])("groups values under the dynamic prototype property name %s", async(groupName) => {
		const input = DGenerator.asyncMap([1, 2] as const, (value) => value);
		const result = await DGenerator.asyncGroup(
			input,
			(value, { output }) => output(groupName, value),
		);

		expect(result[groupName]).toStrictEqual([1, 2]);
		expect(Object.getPrototypeOf(result)).toBeNull();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly [key: string]: readonly [1 | 2, ...(1 | 2)[]] | undefined },
			"strict"
		>;
	});

	it.each(["toString", "constructor", "__proto__"])("groups values under the dynamic prototype property name %s in pipe", async(groupName) => {
		const result = await DCommon.pipe(
			[1, 2] as const,
			DGenerator.asyncMap((value) => value),
			DGenerator.asyncGroup((value, { output }) => output(groupName, value)),
		);

		expect(result[groupName]).toStrictEqual([1, 2]);
		expect(Object.getPrototypeOf(result)).toBeNull();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly [key: string]: readonly [1 | 2, ...(1 | 2)[]] | undefined },
			"strict"
		>;
	});
});
