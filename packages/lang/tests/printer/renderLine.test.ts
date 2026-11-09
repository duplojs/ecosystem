import type * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("renderLine", () => {
	it("renders printable values separated by spaces", () => {
		const result = DPrinter.renderLine([
			"hello",
			["world", null],
			true,
		]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("hello world true");
	});

	it("indents the line once", () => {
		const result = DPrinter.renderLine(["hello", ["world", null], true], {
			indent: DPrinter.Indent.space2,
			indentLevel: 2,
		});

		expect(result).toBe("    hello world true");
	});

	it("uses a custom separator and only indents the beginning", () => {
		const result = DPrinter.renderLine(["alpha\nbeta", "gamma"], {
			joinCharacter: " | ",
			indent: DPrinter.Indent.tab,
			indentLevel: 2,
		});

		expect(result).toBe("\t\talpha\nbeta | gamma");
	});

	it("accepts an empty separator", () => {
		const result = DPrinter.renderLine(["alpha", [false, null, undefined], "", "beta"], { joinCharacter: "" });

		expect(result).toBe("alphabeta");
	});

	it("keeps literal separator strings", () => {
		expect(DPrinter.renderLine(["alpha", "beta"], { joinCharacter: "LF" })).toBe("alphaLFbeta");
	});

	it.each([
		{
			values: [],
			expected: "",
		},
		{
			values: [false, null, [undefined, []]],
			expected: "",
		},
		{
			values: [""],
			expected: "\t",
		},
	] as const)("renders empty input $values", ({ values, expected }) => {
		expect(DPrinter.renderLine(values, {
			indent: DPrinter.Indent.tab,
			indentLevel: 1,
		})).toBe(expected);
	});

	it.each([
		{
			indentLevel: 0,
			expected: "alpha beta",
		},
		{
			indentLevel: -1,
			expected: "alpha beta",
		},
		{
			indentLevel: Number.POSITIVE_INFINITY,
			expected: "alpha beta",
		},
		{
			indentLevel: Number.NEGATIVE_INFINITY,
			expected: "alpha beta",
		},
		{
			indentLevel: Number.NaN,
			expected: "alpha beta",
		},
		{
			indentLevel: 2.8,
			expected: "\t\talpha beta",
		},
	])("handles indentation level $indentLevel", ({ indentLevel, expected }) => {
		expect(DPrinter.renderLine(["alpha", "beta"], {
			indent: DPrinter.Indent.tab,
			indentLevel,
		})).toBe(expected);
	});

	it("does not indent when the level is omitted", () => {
		expect(DPrinter.renderLine(["alpha", "beta"], { indent: DPrinter.Indent.tab })).toBe("alpha beta");
	});

	it("does not indent when the type is omitted", () => {
		expect(DPrinter.renderLine(["alpha", "beta"], { indentLevel: 2 })).toBe("alpha beta");
	});
});
