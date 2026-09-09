import { DGenerator, pipe, type ExpectType } from "@scripts";

describe("group", () => {
	it("creates a group output", () => {
		const result = DGenerator.groupOutput("small", 1);

		expect(result).toStrictEqual({
			group: "small",
			value: 1,
		});

		type _CheckResult = ExpectType<
			typeof result,
			DGenerator.GroupOutputResult<"small", number>,
			"strict"
		>;
	});

	it("creates a group output in pipe", () => {
		const result = pipe(
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

		expect(result).toStrictEqual({
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

		type _CheckResult = ExpectType<
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
		const result = pipe(
			new Set(["alpha", "bee", "ace"] as const),
			DGenerator.group((item, params) => params.output(
				item.startsWith("a") ? "startA" : "other",
				item,
			)),
		);

		expect(result).toStrictEqual({
			startA: ["alpha", "ace"],
			other: ["bee"],
		});

		type _CheckResult = ExpectType<
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

		expect(result).toStrictEqual({});

		type _CheckResult = ExpectType<
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
				type _CheckItem = ExpectType<
					typeof item,
					1 | "a",
					"strict"
				>;

				return params.output("value", item);
			},
		);

		expect(result).toStrictEqual({
			value: [1, "a"],
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				readonly value?: readonly [1 | "a", ...(1 | "a")[]] | undefined;
			},
			"strict"
		>;
	});
});
