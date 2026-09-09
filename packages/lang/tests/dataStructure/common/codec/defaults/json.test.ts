import { DChrono, DDataStructure, DEither } from "@scripts";

describe("codecsJson", () => {
	it("round trips JSON encoded values", () => {
		const structure = DDataStructure.object({
			bigint: DDataStructure.bigint(),
			date: DDataStructure.date(),
			time: DDataStructure.time(),
		});
		const input = {
			bigint: 9007199254740993n,
			date: DChrono.createDateOrThrow(Date.UTC(2024, 0, 2, 3, 4, 5, 6)),
			time: DChrono.createTimeOrThrow(3_661_007),
		};

		const encoded = DEither.unwrapByInformationOrThrow(
			structure.encode(DDataStructure.codecsJson, input),
			"encode-success",
		);
		const decoded = DEither.unwrapByInformationOrThrow(
			structure.decode(DDataStructure.codecsJson, encoded),
			"decode-success",
		);

		expect(encoded).toStrictEqual({
			bigint: input.bigint.toString(),
			date: input.date.toString(),
			time: input.time.toString(),
		});
		expect(decoded).toStrictEqual(input);
	});

	it("rejects invalid encoded values", () => {
		expect(DDataStructure.codecsJson.definition.bigint.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsJson.definition.date.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(DDataStructure.codecsJson.definition.time.decode("invalid")).toBe(
			DDataStructure.ErrorSymbol,
		);
	});
});
