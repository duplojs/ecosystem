import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("required", () => {
	it("makes every object property required", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.optional(
					DDataStructure.string(),
				),
				age: DDataStructure.optional(
					DDataStructure.number(),
				),
			}),
		);
		const input = {
			name: "Jane",
			age: 30,
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.is({
			name: undefined,
			age: 30,
		})).toBe(false);
	});

	it("resolves lazy property structures before removing undefined", () => {
		const getStructure = vi.fn(
			() => DDataStructure.optional(DDataStructure.string()),
		);
		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.lazy(getStructure),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
			},
			"strict"
		>;

		expect(getStructure).not.toHaveBeenCalled();
		expect(
			"values" in (structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
				.definition.getter.value.definition,
		).toBe(false);
		expect(getStructure).toHaveBeenCalledTimes(1);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
		expect(structure.is({ name: undefined })).toBe(false);
	});

	it("keeps a union only when more than one value remains", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				alone: DDataStructure.optional(
					DDataStructure.string(),
				),
				multiple: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
					DDataStructure.undefined(),
				]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly alone: string;
				readonly multiple: string | number;
			},
			"strict"
		>;

		expect(
			"values" in (structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
				.definition.getter.value.definition,
		).toBe(false);
		expect(
			(
				(structure.definition.shape.value[1]!.value as DDataStructure.LazyStructure)
					.definition.getter.value as DDataStructure.UnionStructure
			).definition.values.value,
		).toHaveLength(2);
		expect(structure.check({
			alone: "Jane",
			multiple: 30,
		})).toStrictEqual(
			DEither.right("check-success", {
				alone: "Jane",
				multiple: 30,
			}),
		);
	});

	it("keeps already required structures unchanged", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.string(),
				value: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
				]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly value: string | number;
			},
			"strict"
		>;

		expect(
			"values" in (structure.definition.shape.value[0]!.value as DDataStructure.LazyStructure)
				.definition.getter.value.definition,
		).toBe(false);
		expect(
			(
				(structure.definition.shape.value[1]!.value as DDataStructure.LazyStructure)
					.definition.getter.value as DDataStructure.UnionStructure
			).definition.values.value,
		).toHaveLength(2);
		expect(structure.check({
			name: "Jane",
			value: "ok",
		})).toStrictEqual(
			DEither.right("check-success", {
				name: "Jane",
				value: "ok",
			}),
		);
	});

	it("keeps added refine constraints coherent", () => {
		interface RequiredUser {
			readonly name: string;
			readonly age: number;
		}
		interface AdultUser {
			readonly name: string;
			readonly age: 18;
		}

		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.optional(
					DDataStructure.string(),
				),
				age: DDataStructure.optional(
					DDataStructure.number(),
				),
			}),
		).addConstraint(
			DDataStructure.refine(
				(data): data is AdultUser => {
					type check = ExpectType<
						typeof data,
						RequiredUser,
						"strict"
					>;

					return data.age === 18;
				},
			),
		);

		type _CheckConstraints = ExpectType<
			typeof structure,
			DDataStructure.Structure<
				{
					readonly name: string;
					readonly age: number;
				},
				DDataStructure.StructureDefinition<
					readonly [
						DDataStructure.RefineConstraint<
							{
								readonly name: string;
								readonly age: number;
							},
							AdultUser
						>,
					]
				>
			>,
			"strict"
		>;
		type _CheckValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			RequiredUser & AdultUser,
			"strict"
		>;

		const invalidStructure = DDataStructure.required(
			DDataStructure.object({ name: DDataStructure.string() }),
		);

		// @ts-expect-error required object structures cannot add string constraints.
		invalidStructure.addConstraint(DDataStructure.email());
	});
});
