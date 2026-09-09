import { DDataStructure, DEither, DModeling, pipe, type ExpectType } from "@scripts";

describe("unwrapByInformationOrThrow", () => {
	it("should unwrap matching information", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.unwrapByInformationOrThrow(input, "success");

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;
	});

	it("should unwrap one of multiple matching informations in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.unwrapByInformationOrThrow(["success", "error"]),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			42 | "message",
			"strict"
		>;
	});

	it("should throw when information does not match", () => {
		const input = DEither.error("message");

		expect(() => DEither.unwrapByInformationOrThrow(input, "success" as never))
			.toThrow(DEither.HasNotInformationError);

		try {
			DEither.unwrapByInformationOrThrow(input, ["success"] as never);
		} catch (error) {
			expect(error).toBeInstanceOf(DEither.HasNotInformationError);

			if (error instanceof DEither.HasNotInformationError) {
				expect(error.message).toBe("Value has not information \"success\".");
				expect(error.value).toBe(input);
				expect(error.information).toStrictEqual(["success"]);
			}
		}
	});

	it("should preserve inference for a directly nested decodeMap result", () => {
		const structure = DModeling.NewTypeStructure(
			"nested-number",
			DDataStructure.number(),
			[],
		);
		const codecs = DDataStructure.createCodecs({});
		const result = DEither.unwrapByInformationOrThrow(
			structure.decodeMap(codecs, 42),
			"map-success",
		);

		type _CheckResult = ExpectType<
			typeof result,
			number & DModeling.NewType<"nested-number">,
			"strict"
		>;

		expect(result).toBe(42);
	});
});
