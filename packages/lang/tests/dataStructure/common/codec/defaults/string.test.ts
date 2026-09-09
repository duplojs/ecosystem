import { DChrono, DDataStructure, DEither } from "@scripts";

describe("codecsString", () => {
	it("round trips string encoded values", () => {
		const structure = DDataStructure.object({
			bigint: DDataStructure.bigint(),
			boolean: DDataStructure.boolean(),
			date: DDataStructure.date(),
			null: DDataStructure.null(),
			number: DDataStructure.number(),
			time: DDataStructure.time(),
			undefined: DDataStructure.undefined(),
		});
		const input = {
			bigint: 9007199254740993n,
			boolean: true,
			date: DChrono.createDateOrThrow(Date.UTC(2024, 0, 2, 3, 4, 5, 6)),
			null: null,
			number: -12.5,
			time: DChrono.createTimeOrThrow(3_661_007),
			undefined: undefined,
		};

		const encoded = DEither.unwrapByInformationOrThrow(
			structure.encode(DDataStructure.codecsString, input),
			"encode-success",
		);
		const decoded = DEither.unwrapByInformationOrThrow(
			structure.decode(DDataStructure.codecsString, encoded),
			"decode-success",
		);

		expect(encoded).toStrictEqual({
			bigint: input.bigint.toString(),
			boolean: "true",
			date: input.date.toString(),
			null: "null",
			number: input.number.toString(),
			time: input.time.toString(),
			undefined: "undefined",
		});
		expect(decoded).toStrictEqual(input);
	});

	it("decodes both boolean values", () => {
		expect(DDataStructure.codecsString.definition.boolean.decode("true")).toBe(true);
		expect(DDataStructure.codecsString.definition.boolean.decode("false")).toBe(false);
	});

	it("returns an error when number conversion throws", () => {
		const numberSpy = vi.spyOn(globalThis, "Number").mockImplementationOnce(() => {
			throw new Error("number-conversion-error");
		});

		expect(DDataStructure.codecsString.definition.number.decode("12" as never)).toBe(
			DDataStructure.ErrorSymbol,
		);

		numberSpy.mockRestore();
	});

	it("rejects invalid encoded values", () => {
		expect(DDataStructure.codecsString.definition.bigint.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.boolean.decode("invalid" as never)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.date.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.null.decode("invalid" as never)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.number.decode("invalid" as never)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.time.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsString.definition.undefined.decode("invalid" as never)).toBe(
			DDataStructure.ErrorSymbol,
		);
	});
});
