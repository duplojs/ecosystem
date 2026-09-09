import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("extend", () => {
	it("extends an object structure with additional properties", () => {
		const base = DDataStructure.object({
			name: DDataStructure.string(),
		});
		const structure = DDataStructure.extend(
			base,
			{
				age: DDataStructure.number(),
			},
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

		expect(structure.definition.shape.value).toHaveLength(2);
		expect(structure.definition.keys).toStrictEqual([
			"name",
			"age",
		]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("overrides existing properties with the added shape", () => {
		const base = DDataStructure.object({
			value: DDataStructure.string(),
		});
		const structure = DDataStructure.extend(
			base,
			{
				value: DDataStructure.number(),
			},
		);
		const input = {
			value: 42,
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value: number;
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is({ value: "42" })).toBe(false);
	});

	it("keeps added refine constraints coherent", () => {
		interface ExtendedUser {
			readonly name: string;
			readonly age: number;
		}
		interface AdultUser {
			readonly name: string;
			readonly age: 18;
		}

		const structure = DDataStructure.extend(
			DDataStructure.object({
				name: DDataStructure.string(),
			}),
			{
				age: DDataStructure.number(),
			},
		).addConstraint(
			DDataStructure.refine(
				(data): data is AdultUser => {
					type check = ExpectType<
						typeof data,
						ExtendedUser,
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
			ExtendedUser & AdultUser,
			"strict"
		>;

		const invalidStructure = DDataStructure.extend(
			DDataStructure.object({ name: DDataStructure.string() }),
			{ age: DDataStructure.number() },
		);

		// @ts-expect-error extended object structures cannot add string constraints.
		invalidStructure.addConstraint(DDataStructure.email());
	});
});
