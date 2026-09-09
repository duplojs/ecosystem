import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("numberInString", () => {
	it("creates a number in string constraint", () => {
		const constraint = DDataStructure.numberInString();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.NumberInStringConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Number,
			"strict"
		>;

		expect(constraint.executeCheck("12.5")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("not-a-number")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DDataStructure.object({
			data: DDataStructure.object({
				number: DDataStructure.string([DDataStructure.numberInString()]),
			}),
		});
		const input = {
			data: {
				number: "12.5",
			},
		};
		const invalidInput = {
			data: {
				number: "not-a-number",
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly data: {
					readonly number: string & DString.Number;
				};
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(invalidInput),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "not-a-number",
			path: "data.number",
		});
	});
});
