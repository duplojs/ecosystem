import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("number", () => {
	it("creates a number type structure", () => {
		const structure = DDataStructure.number();
		const success = structure.check(12);
		const failure = structure.check("12");

		type _CheckStructure = DCommon.ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<number, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			number,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheNumber);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", 12));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "12",
			path: "",
		});
	});

	it("can be used inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				age: DDataStructure.number(),
			}),
		});
		const input = {
			user: {
				age: 30,
			},
		};

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly age: number;
				};
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});

	it("keeps direct and added refine constraints coherent", () => {
		const directStructure = DDataStructure.number([
			DDataStructure.refine(
				(data): data is 1 => {
					type check = DCommon.ExpectType<
						typeof data,
						number,
						"strict"
					>;

					return data === 1;
				},
			),
		]);
		const addedStructure = DDataStructure.number().addConstraint(
			DDataStructure.refine(
				(data): data is 1 => {
					type check = DCommon.ExpectType<
						typeof data,
						number,
						"strict"
					>;

					return data === 1;
				},
			),
		);

		type _CheckDirectConstraints = DCommon.ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				number,
				readonly [DDataStructure.RefineConstraint<number, 1>]
			>,
			"strict"
		>;
		type _CheckDirectValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			1,
			"strict"
		>;
		type _CheckAddedConstraints = DCommon.ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				number,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<number, 1>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			1,
			"strict"
		>;

		// @ts-expect-error number structures cannot receive string constraints.
		DDataStructure.number([DDataStructure.email()]);
		// @ts-expect-error number structures cannot add string constraints.
		DDataStructure.number().addConstraint(DDataStructure.email());
	});
});
