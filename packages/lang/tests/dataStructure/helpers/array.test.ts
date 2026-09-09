import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("array", () => {
	it("creates an array structure from an element structure", () => {
		const structure = DDataStructure.array(DDataStructure.string());
		const success = structure.check(["Jane", "John"]);
		const failure = structure.check(["Jane", 12]);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.ArrayStructure<readonly string[], readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			readonly string[],
			"strict"
		>;

		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.definition.element.check("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", ["Jane", "John"]),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "[array: 1]",
		});
	});

	it("can be used inside object helpers and nested array helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				tags: DDataStructure.array(DDataStructure.string()),
				groups: DDataStructure.array(DDataStructure.array(DDataStructure.number())),
			}),
		});
		const input = {
			user: {
				tags: ["admin", "member"],
				groups: [[1, 2], [3]],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly tags: readonly string[];
					readonly groups: readonly (readonly number[])[];
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
		const directStructure = DDataStructure.array(
			DDataStructure.string(),
			[
				DDataStructure.refine(
					(data): data is readonly [string, ...string[]] => {
						type check = ExpectType<
							typeof data,
							readonly string[],
							"strict"
						>;

						return data.length > 0;
					},
				),
			],
		);
		const addedStructure = DDataStructure.array(
			DDataStructure.string(),
		).addConstraint(
			DDataStructure.refine(
				(data): data is readonly [string, ...string[]] => {
					type check = ExpectType<
						typeof data,
						readonly string[],
						"strict"
					>;

					return data.length > 0;
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.ArrayStructure<
				readonly string[],
				readonly [DDataStructure.RefineConstraint<readonly string[], readonly [string, ...string[]]>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			readonly string[] & readonly [string, ...string[]],
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				readonly string[],
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<readonly string[], readonly [string, ...string[]]>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			readonly string[] & readonly [string, ...string[]],
			"strict"
		>;

		// @ts-expect-error array structures cannot receive string constraints.
		DDataStructure.array(DDataStructure.string(), [DDataStructure.email()]);
		// @ts-expect-error array structures cannot add string constraints.
		DDataStructure.array(DDataStructure.string()).addConstraint(DDataStructure.email());
	});
});
