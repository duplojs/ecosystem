import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import type * as DString from "@scripts/string";

describe("minCharacters", () => {
	it("creates a string minimum constraint", () => {
		const constraint = DDataStructure.minCharacters(3);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.MinCharactersConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.MinCharacters<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			}),
		});
		const input = {
			user: {
				name: "Jane",
			},
		};
		const invalidInput = {
			user: {
				name: "Jo",
			},
		};

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly name: string & DString.MinCharacters<3>;
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
			data: "Jo",
			path: "user.name",
		});
	});
});
