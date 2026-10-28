import type * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("date", () => {
	it("creates a date type structure", () => {
		const structure = DDataStructure.date();
		const value = DChrono.createDateOrThrow(0);
		const success = structure.check(value);
		const failure = structure.check(new Date(0));

		type _CheckStructure = DCommon.ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<DChrono.TheDate, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DChrono.TheDate,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheDate);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", value));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: new Date(0),
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			calendar: DDataStructure.object({
				start: DDataStructure.date(),
				holidays: DDataStructure.array(DDataStructure.date()),
			}),
		});
		const input = {
			calendar: {
				start: DChrono.createDateOrThrow(0),
				holidays: [
					DChrono.createDateOrThrow(1),
					DChrono.createDateOrThrow(2),
				],
			},
		};

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly calendar: {
					readonly start: DChrono.TheDate;
					readonly holidays: readonly DChrono.TheDate[];
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
		type EpochDate = DChrono.TheDate & {
			readonly __epochDate: true;
		};

		const directStructure = DDataStructure.date([
			DDataStructure.refine(
				(data): data is EpochDate => {
					type check = DCommon.ExpectType<
						typeof data,
						DChrono.TheDate,
						"strict"
					>;

					return data.toString().length > 0;
				},
			),
		]);
		const addedStructure = DDataStructure.date().addConstraint(
			DDataStructure.refine(
				(data): data is EpochDate => {
					type check = DCommon.ExpectType<
						typeof data,
						DChrono.TheDate,
						"strict"
					>;

					return data.toString().length > 0;
				},
			),
		);

		type _CheckDirectConstraints = DCommon.ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				DChrono.TheDate,
				readonly [DDataStructure.RefineConstraint<DChrono.TheDate, EpochDate>]
			>,
			"strict"
		>;
		type _CheckDirectValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			EpochDate,
			"strict"
		>;
		type _CheckAddedConstraints = DCommon.ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				DChrono.TheDate,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<DChrono.TheDate, EpochDate>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			EpochDate,
			"strict"
		>;

		// @ts-expect-error date structures cannot receive string constraints.
		DDataStructure.date([DDataStructure.email()]);
		// @ts-expect-error date structures cannot add string constraints.
		DDataStructure.date().addConstraint(DDataStructure.email());
	});
});
