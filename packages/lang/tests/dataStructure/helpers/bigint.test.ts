import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("bigint", () => {
	it("creates a bigint type structure", () => {
		const structure = DDataStructure.bigint();
		const success = structure.check(12n);
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<bigint, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			bigint,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheBigint);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", 12n));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("can be used inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				balance: DDataStructure.bigint(),
			}),
		});
		const input = {
			user: {
				balance: 120n,
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly balance: bigint;
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
		const directStructure = DDataStructure.bigint([
			DDataStructure.refine(
				(data): data is 1n => {
					type check = ExpectType<
						typeof data,
						bigint,
						"strict"
					>;

					return data === 1n;
				},
			),
		]);
		const addedStructure = DDataStructure.bigint().addConstraint(
			DDataStructure.refine(
				(data): data is 1n => {
					type check = ExpectType<
						typeof data,
						bigint,
						"strict"
					>;

					return data === 1n;
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				bigint,
				readonly [DDataStructure.RefineConstraint<bigint, 1n>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			1n,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				bigint,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<bigint, 1n>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			1n,
			"strict"
		>;

		// @ts-expect-error bigint structures cannot receive string constraints.
		DDataStructure.bigint([DDataStructure.email()]);
		// @ts-expect-error bigint structures cannot add string constraints.
		DDataStructure.bigint().addConstraint(DDataStructure.email());
	});
});
