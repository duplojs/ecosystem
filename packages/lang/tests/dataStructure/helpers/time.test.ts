import { DChrono, DDataStructure, DEither, type ExpectType } from "@scripts";

describe("time", () => {
	it("creates a time type structure", () => {
		const structure = DDataStructure.time();
		const value = DChrono.createTimeOrThrow(0);
		const success = structure.check(value);
		const failure = structure.check(0);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<DChrono.TheTime, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DChrono.TheTime,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheTime);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", value));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 0,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			schedule: DDataStructure.object({
				openAt: DDataStructure.time(),
				slots: DDataStructure.array(DDataStructure.time()),
			}),
		});
		const input = {
			schedule: {
				openAt: DChrono.createTimeOrThrow(0),
				slots: [
					DChrono.createTimeOrThrow(1),
					DChrono.createTimeOrThrow(2),
				],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly schedule: {
					readonly openAt: DChrono.TheTime;
					readonly slots: readonly DChrono.TheTime[];
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
		type OpeningTime = DChrono.TheTime & {
			readonly __openingTime: true;
		};

		const directStructure = DDataStructure.time([
			DDataStructure.refine(
				(data): data is OpeningTime => {
					type check = ExpectType<
						typeof data,
						DChrono.TheTime,
						"strict"
					>;

					return data.toString().length > 0;
				},
			),
		]);
		const addedStructure = DDataStructure.time().addConstraint(
			DDataStructure.refine(
				(data): data is OpeningTime => {
					type check = ExpectType<
						typeof data,
						DChrono.TheTime,
						"strict"
					>;

					return data.toString().length > 0;
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				DChrono.TheTime,
				readonly [DDataStructure.RefineConstraint<DChrono.TheTime, OpeningTime>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			OpeningTime,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				DChrono.TheTime,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<DChrono.TheTime, OpeningTime>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			OpeningTime,
			"strict"
		>;

		// @ts-expect-error time structures cannot receive string constraints.
		DDataStructure.time([DDataStructure.email()]);
		// @ts-expect-error time structures cannot add string constraints.
		DDataStructure.time().addConstraint(DDataStructure.email());
	});
});
