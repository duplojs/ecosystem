import { DDataStructure, type ExpectType, pipe, when } from "@scripts";

describe("typeStructureIdentifier", () => {
	it("identifies a type structure from its type kind", () => {
		const structure: DDataStructure.Structure = DDataStructure.number();

		if (DDataStructure.typeStructureIdentifier(
			structure,
			DDataStructure.numberTypeKind,
		)) {
			type _CheckStructure = ExpectType<
				typeof structure,
				DDataStructure.TypeStructure<number>,
				"strict"
			>;

			expect(structure.definition.type).toMatchObject({
				fundamentalType: DDataStructure.TheNumber,
			});
		}
	});

	it("returns false when the type kind does not match", () => {
		expect(
			DDataStructure.typeStructureIdentifier(
				DDataStructure.string(),
				DDataStructure.numberTypeKind,
			),
		).toBe(false);
	});

	it("returns false for a structure that is not a type structure", () => {
		expect(
			DDataStructure.typeStructureIdentifier(
				DDataStructure.array(DDataStructure.number()),
				DDataStructure.numberTypeKind,
			),
		).toBe(false);
	});

	it("narrows a type structure in a pipe with when", () => {
		const structure: DDataStructure.Structure = DDataStructure.number();

		const result = pipe(
			structure,
			when(
				DDataStructure.typeStructureIdentifier(
					DDataStructure.numberTypeKind,
				),
				(numberStructure) => {
					type _CheckNumberStructure = ExpectType<
						typeof numberStructure,
						DDataStructure.TypeStructure<number>,
						"strict"
					>;

					return numberStructure.definition.type.fundamentalType;
				},
			),
		);

		expect(result).toBe(DDataStructure.TheNumber);
	});
});
