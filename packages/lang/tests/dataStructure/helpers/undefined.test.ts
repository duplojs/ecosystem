import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("undefined", () => {
	it("creates an undefined type structure", () => {
		const structure = DDataStructure.undefined();
		const success = structure.check(undefined);
		const failure = structure.check(null);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<undefined, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			undefined,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheUndefined);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			state: DDataStructure.object({
				missing: DDataStructure.undefined(),
				items: DDataStructure.array(DDataStructure.undefined()),
			}),
		});
		const input = {
			state: {
				missing: undefined,
				items: [undefined, undefined],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly state: {
					readonly missing?: undefined;
					readonly items: readonly undefined[];
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
		const directStructure = DDataStructure.undefined([
			DDataStructure.refine(
				(data): data is undefined => {
					type check = ExpectType<
						typeof data,
						undefined,
						"strict"
					>;

					return data === undefined;
				},
			),
		]);
		const addedStructure = DDataStructure.undefined().addConstraint(
			DDataStructure.refine(
				(data): data is undefined => {
					type check = ExpectType<
						typeof data,
						undefined,
						"strict"
					>;

					return data === undefined;
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				undefined,
				readonly [DDataStructure.RefineConstraint<undefined, undefined>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			undefined,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				undefined,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<undefined, undefined>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			undefined,
			"strict"
		>;

		// @ts-expect-error undefined structures cannot receive string constraints.
		DDataStructure.undefined([DDataStructure.email()]);
		// @ts-expect-error undefined structures cannot add string constraints.
		DDataStructure.undefined().addConstraint(DDataStructure.email());
	});
});
