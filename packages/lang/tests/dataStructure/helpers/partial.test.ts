import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("partial", () => {
	it("makes every object property optional", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name?: string;
				readonly age?: number;
			},
			"strict"
		>;

		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
		expect(structure.is({ name: undefined })).toBe(true);
	});

	it("keeps property constraints when adding undefined to a non-union structure", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly email?: string & DString.Email | undefined;
			},
			"strict"
		>;

		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
		expect(structure.check({ email: "jane@example.com" })).toStrictEqual(
			DEither.right("check-success", { email: "jane@example.com" }),
		);
		expect(structure.is({ email: "not-an-email" })).toBe(false);
	});

	it("resolves lazy property structures before adding undefined", () => {
		const getStructure = vi.fn(
			() => DDataStructure.string(),
		);
		const structure = DDataStructure.partial(
			DDataStructure.object({
				name: DDataStructure.lazy(getStructure),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name?: string | undefined;
			},
			"strict"
		>;

		expect(getStructure).not.toHaveBeenCalled();
		expect(
			(
				(structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
					.definition.getter.value as DDataStructure.UnionStructure
			).definition.values.value,
		).toHaveLength(2);
		expect(getStructure).toHaveBeenCalledTimes(1);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
	});

	it("does not add undefined twice inside an existing union", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				value: DDataStructure.optional(
					DDataStructure.string(),
				),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value?: string | undefined;
			},
			"strict"
		>;

		expect(
			(
				(structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
					.definition.getter.value as DDataStructure.UnionStructure
			).definition.values.value,
		).toHaveLength(2);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
	});

	it("adds undefined to an existing union without an undefined branch", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				value: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
				]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value?: string | number | undefined;
			},
			"strict"
		>;

		expect(
			(
				(structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
					.definition.getter.value as DDataStructure.UnionStructure
			).definition.values.value,
		).toHaveLength(3);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
	});

	it("keeps an undefined structure unchanged", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				value: DDataStructure.undefined(),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value?: undefined;
			},
			"strict"
		>;

		expect(
			"values" in (structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
				.definition.getter.value.definition,
		).toBe(false);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
	});

	it("keeps added refine constraints coherent", () => {
		interface PartialUser {
			readonly name?: string;
			readonly age?: number;
		}
		interface PartialUserWithName {
			readonly name: string;
			readonly age?: number;
		}

		const structure = DDataStructure.partial(
			DDataStructure.object({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		).addConstraint(
			DDataStructure.refine(
				(data): data is PartialUserWithName => {
					type check = ExpectType<
						typeof data,
						PartialUser,
						"strict"
					>;

					return data.name !== undefined;
				},
			),
		);

		type _CheckConstraints = ExpectType<
			typeof structure,
			DDataStructure.Structure<
				{
					readonly name?: string;
					readonly age?: number;
				},
				DDataStructure.StructureDefinition<
					readonly [
						DDataStructure.RefineConstraint<
							{
								readonly name?: string;
								readonly age?: number;
							},
							PartialUserWithName
						>,
					]
				>
			>,
			"strict"
		>;
		type _CheckValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			PartialUser & PartialUserWithName,
			"strict"
		>;

		const invalidStructure = DDataStructure.partial(
			DDataStructure.object({ name: DDataStructure.string() }),
		);

		// @ts-expect-error partial object structures cannot add string constraints.
		invalidStructure.addConstraint(DDataStructure.email());
	});
});
