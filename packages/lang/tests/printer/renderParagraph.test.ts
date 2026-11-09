import * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("renderParagraph", () => {
	it("renders printable values separated by line breaks", () => {
		const result = DPrinter.renderParagraph([
			"title",
			["", "body"],
			false,
			true,
		]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("title\n\nbody\ntrue");
	});

	it.each([
		{
			back: DPrinter.Back.LF,
			expected: "\ttitle\n\tbody\n\ttrue",
		},
		{
			back: DPrinter.Back.CRLF,
			expected: "\ttitle\r\n\tbody\r\n\ttrue",
		},
	])("renders indented paragraphs with $back", ({ back, expected }) => {
		const result = DPrinter.renderParagraph(["title", ["body", false], true], {
			back,
			indent: DPrinter.Indent.tab,
			indentLevel: 1,
		});

		expect(result).toBe(expected);
	});

	it("renders a paragraph in a pipe", () => {
		const result = DCommon.pipe(
			["title", ["body", null], true] as const,
			DPrinter.renderParagraph({
				back: DPrinter.Back.CRLF,
				indent: DPrinter.Indent.space4,
				indentLevel: 1,
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

		expect(result).toBe("    title\r\n    body\r\n    true");
	});

	it("uses the default parameters in a pipe", () => {
		const result = DCommon.pipe(["title", "body"], DPrinter.renderParagraph({}));

		expect(result).toBe("title\nbody");
	});

	it("indents a composed paragraph on every line", () => {
		const inner = DPrinter.renderParagraph(["alpha", "beta"], {
			indent: DPrinter.Indent.tab,
			indentLevel: 1,
		});
		const result = DPrinter.renderParagraph(["title", inner], {
			indent: DPrinter.Indent.tab,
			indentLevel: 1,
		});

		expect(result).toBe("\ttitle\n\t\talpha\n\t\tbeta");
	});

	it.each([
		{
			indent: DPrinter.Indent.space1,
			expected: "  alpha\n  beta",
		},
		{
			indent: DPrinter.Indent.space2,
			expected: "    alpha\n    beta",
		},
		{
			indent: DPrinter.Indent.space3,
			expected: "      alpha\n      beta",
		},
		{
			indent: DPrinter.Indent.space4,
			expected: "        alpha\n        beta",
		},
	])("resolves $indent with the requested level", ({ indent, expected }) => {
		expect(DPrinter.renderParagraph(["alpha", "beta"], {
			indent,
			indentLevel: 2,
		})).toBe(expected);
	});

	it("indents multiline strings and preserves blank lines and line endings", () => {
		const result = DPrinter.renderParagraph(["alpha\r\nbeta", "", "gamma\n"], {
			indent: DPrinter.Indent.space2,
			indentLevel: 1,
		});

		expect(result).toBe("  alpha\r\n  beta\n  \n  gamma\n  ");
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
		expect(DPrinter.renderParagraph(values, {
			indent: DPrinter.Indent.tab,
			indentLevel: 1,
		})).toBe(expected);
	});

	it("does not indent when the level is omitted", () => {
		expect(DPrinter.renderParagraph(["alpha", "beta"], { indent: DPrinter.Indent.tab })).toBe("alpha\nbeta");
	});

	it("does not indent when the type is omitted", () => {
		expect(DPrinter.renderParagraph(["alpha", "beta"], { indentLevel: 2 })).toBe("alpha\nbeta");
	});
});
