import { DDataStructure, DModeling, type DString, type ExpectType } from "@scripts";

describe("createNewType", () => {
	it("creates a capitalized new type with optional constraints", () => {
		const structure = DModeling.createNewType(
			"UserName",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.NewTypeStructure<
				"UserName",
				string,
				readonly [DDataStructure.MinCharactersConstraint<3>]
			>,
			"strict"
		>;
		type _CheckValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DModeling.NewType<"UserName", DString.MinCharacters<3>>,
			"strict"
		>;

		expect(structure.name).toBe("UserName");
		expect(structure.executeCheck("Jane")).toBe(DDataStructure.SuccessSymbol);
		expect(structure.executeCheck("Jo")).toBe(DDataStructure.ErrorSymbol);
	});

	it("uses no new type constraint by default", () => {
		const structure = DModeling.createNewType(
			"UserAge",
			DDataStructure.number(),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.NewTypeStructure<"UserAge", number, readonly []>,
			"strict"
		>;

		expect(structure.definition.newTypeConstraints).toStrictEqual([]);
	});

	it("rejects an existing new type as its top-level structure", () => {
		const name = DModeling.createNewType("UserName", DDataStructure.string());

		// @ts-expect-error a NewType cannot be wrapped directly in another NewType.
		DModeling.createNewType("UserOtherName", name);
	});
});
