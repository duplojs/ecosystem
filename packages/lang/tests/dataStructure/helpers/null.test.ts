import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("null", () => {
	it("creates a null type structure", () => {
		const structure = DDataStructure.null();
		const success = structure.check(null);
		const failure = structure.check(undefined);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<null, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			null,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheNull);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", null));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: undefined,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			state: DDataStructure.object({
				empty: DDataStructure.null(),
				items: DDataStructure.array(DDataStructure.null()),
			}),
		});
		const input = {
			state: {
				empty: null,
				items: [null, null],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly state: {
					readonly empty: null;
					readonly items: readonly null[];
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
		const directStructure = DDataStructure.null([
			DDataStructure.refine(
				(data): data is null => {
					type check = ExpectType<
						typeof data,
						null,
						"strict"
					>;

					return data === null;
				},
			),
		]);
		const addedStructure = DDataStructure.null().addConstraint(
			DDataStructure.refine(
				(data): data is null => {
					type check = ExpectType<
						typeof data,
						null,
						"strict"
					>;

					return data === null;
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				null,
				readonly [DDataStructure.RefineConstraint<null, null>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			null,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				null,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<null, null>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			null,
			"strict"
		>;

		// @ts-expect-error null structures cannot receive string constraints.
		DDataStructure.null([DDataStructure.email()]);
		// @ts-expect-error null structures cannot add string constraints.
		DDataStructure.null().addConstraint(DDataStructure.email());
	});
});
