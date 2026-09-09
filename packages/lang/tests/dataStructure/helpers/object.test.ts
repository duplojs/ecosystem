import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("object", () => {
	it("creates an object structure from helper shapes", () => {
		const structure = DDataStructure.object({
			name: DDataStructure.string(),
			age: DDataStructure.number(),
		});
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
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("keeps nested object helper output coherent", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				profile: DDataStructure.object({
					name: DDataStructure.string(),
					contact: DDataStructure.object({
						email: DDataStructure.string([DDataStructure.email()]),
					}),
				}),
			}),
		});
		const input = {
			user: {
				profile: {
					name: "Jane",
					contact: {
						email: "jane@example.com",
					},
				},
			},
		};

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.ObjectStructure<{
				readonly user: {
					readonly profile: {
						readonly name: string;
						readonly contact: {
							readonly email: string & DString.Email;
						};
					};
				};
			}, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly profile: {
						readonly name: string;
						readonly contact: {
							readonly email: string & DString.Email;
						};
					};
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
		interface User {
			readonly name: string;
			readonly age: number;
		}
		interface Jane {
			readonly name: "Jane";
			readonly age: number;
		}

		const directStructure = DDataStructure.object(
			{
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			},
			[
				DDataStructure.refine(
					(data): data is Jane => {
						type check = ExpectType<
							typeof data,
							User,
							"strict"
						>;

						return data.name === "Jane";
					},
				),
			],
		);
		const addedStructure = DDataStructure.object({
			name: DDataStructure.string(),
			age: DDataStructure.number(),
		}).addConstraint(
			DDataStructure.refine(
				(data): data is Jane => {
					type check = ExpectType<
						typeof data,
						User,
						"strict"
					>;

					return data.name === "Jane";
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.ObjectStructure<
				{
					readonly name: string;
					readonly age: number;
				},
				readonly [
					DDataStructure.RefineConstraint<
						{
							readonly name: string;
							readonly age: number;
						},
						Jane
					>,
				]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			User & Jane,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
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
							Jane
						>,
					]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			User & Jane,
			"strict"
		>;

		// @ts-expect-error object structures cannot receive number constraints.
		DDataStructure.object({ name: DDataStructure.string() }, [DDataStructure.positive()]);
		// @ts-expect-error object structures cannot add number constraints.
		DDataStructure.object({ name: DDataStructure.string() }).addConstraint(DDataStructure.positive());
	});
});
