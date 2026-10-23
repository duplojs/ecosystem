import * as DCommon from "@scripts/common";
import * as DPrinter from "@scripts/printer";

describe("render", () => {
	it("renders nested printable values", () => {
		const result = DPrinter.render(
			[
				"alpha",
				["beta", false, null, undefined],
				true,
				["gamma"],
			],
			" | ",
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("alpha | beta | true | gamma");
	});

	it("renders values in a pipe", () => {
		const result = DCommon.pipe(
			[
				"title",
				["", "body"],
				false,
				true,
			] as const,
			DPrinter.render("\n"),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("title\n\nbody\ntrue");
	});
});
