import * as DGenerator from "@scripts/generator";
import * as DCommon from "@scripts/common";

describe("group", () => {
	it("creates a group output", () => {
		const result = DGenerator.groupOutput("small", 1);

		expect(result).toStrictEqual({
			group: "small",
			value: 1,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DGenerator.GroupOutputResult<"small", number>,
			"strict"
		>;
	});

	it("creates a group output in pipe", () => {
		const result = DCommon.pipe(
			1,
			DGenerator.groupOutput("small"),
		);

		expect(result).toStrictEqual({
			group: "small",
			value: 1,
		});
	});

	it("groups iterable values by callback output", () => {
		const result = DGenerator.group(
			["a", "bb", "c"] as const,
			(item, params) => params.output(
				item.length === 1 ? "short" : "long",
				{
					item,
					index: params.index,
				},
			),
		);

		expect(result).toEqual({
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
			{
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
			},
			"flexible"
		>;
	});

	it("groups values in pipe", () => {
		const result = DCommon.pipe(
			new Set(["alpha", "bee", "ace"] as const),
			DGenerator.group((item, params) => params.output(
				item.startsWith("a") ? "startA" : "other",
				item,
			)),
		);

		expect(result).toEqual({
			startA: ["alpha", "ace"],
			other: ["bee"],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				readonly startA?: readonly ["alpha" | "bee" | "ace", ...("alpha" | "bee" | "ace")[]] | undefined;
				readonly other?: readonly ["alpha" | "bee" | "ace", ...("alpha" | "bee" | "ace")[]] | undefined;
			},
			"strict"
		>;
	});

	it("returns an empty result for an empty iterable", () => {
		const result = DGenerator.group(
			[] as const,
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

	it("preserves item unions when grouping iterable input", () => {
		const input = [1, "a"] as (1 | "a")[];
		const result = DGenerator.group(
			input,
			(item, params) => {
				type _CheckItem = DCommon.ExpectType<
					typeof item,
					1 | "a",
					"strict"
				>;

				return params.output("value", item);
			},
		);

		expect(result).toEqual({
			value: [1, "a"],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				readonly value?: readonly [1 | "a", ...(1 | "a")[]] | undefined;
			},
			"strict"
		>;
	});

	it.each(["toString", "constructor", "__proto__"])("groups values under the dynamic prototype property name %s", (groupName) => {
		const result = DGenerator.group(
			[1, 2] as const,
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

	it.each(["toString", "constructor", "__proto__"])("groups values under the dynamic prototype property name %s in pipe", (groupName) => {
		const result = DCommon.pipe(
			[1, 2] as const,
			DGenerator.group((value, { output }) => output(groupName, value)),
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
