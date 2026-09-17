import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("extend", () => {
	it("extends an object structure shape with additional properties", () => {
		const name = DDataStructure.string();
		const age = DDataStructure.number();
		const base = DDataStructure.object({
			name,
		});
		const structure = DDataStructure.extend(
			base,
			{
				age,
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

		expect(structure.definition.shape).toStrictEqual({
			name,
			age,
		});
		expect(structure.definition.optimizedShape.value).toHaveLength(2);
		expect(structure.definition.keys).toStrictEqual([
			"name",
			"age",
		]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("overrides existing properties in the extended shape", () => {
		const sourceValue = DDataStructure.string();
		const addedValue = DDataStructure.number();
		const base = DDataStructure.object({
			value: sourceValue,
		});
		const structure = DDataStructure.extend(
			base,
			{
				value: addedValue,
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

		expect(structure.definition.shape.value).toBe(addedValue);
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
