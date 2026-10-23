import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";

describe("unwrapByInformation", () => {
	it("should unwrap matching information and keep other values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.unwrapByInformation(input, "success");

		expect(result).toBe(42);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			42 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should unwrap multiple matching informations in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = DCommon.pipe(
			input,
			DEither.unwrapByInformation(["success", "error"]),
		);

		expect(result).toBe("message");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			42 | "message",
			"strict"
		>;
	});

	it("should keep plain inputs unchanged", () => {
		const result = DEither.unwrapByInformation("plain", "success" as never);

		expect(result).toBe("plain");
	});

	it("should preserve inference for a directly nested decodeMap result", () => {
		const structure = DModeling.NewTypeStructure(
			"nested-number",
			DDataStructure.number(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.unwrapByInformation(
			structure.decodeMap(codecs, 42),
			"map-success",
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| (number & DModeling.NewType<"nested-number">)
			| DEither.Left<"async-error", DDataStructure.ErrorPromise>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toBe(42);
	});
});
