import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("string", () => {
	it("creates a string type structure", () => {
		const structure = DDataStructure.string();
		const success = structure.check("value");
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<string, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheString);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("preserves constraint output inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			}),
		});
		const input = {
			user: {
				email: "jane@example.com",
				name: "Jane",
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly email: string & DString.Email;
					readonly name: string & DString.MinCharacters<3>;
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
		const directStructure = DDataStructure.string([
			DDataStructure.refine(
				(data): data is `user:${string}` => {
					type check = ExpectType<
						typeof data,
						string,
						"strict"
					>;

					return data.startsWith("user:");
				},
			),
		]);
		const addedStructure = DDataStructure.string().addConstraint(
			DDataStructure.refine(
				(data): data is `user:${string}` => {
					type check = ExpectType<
						typeof data,
						string,
						"strict"
					>;

					return data.startsWith("user:");
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.TypeStructure<
				string,
				readonly [DDataStructure.RefineConstraint<string, `user:${string}`>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			`user:${string}`,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				string,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<string, `user:${string}`>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			`user:${string}`,
			"strict"
		>;

		// @ts-expect-error string structures cannot receive number constraints.
		DDataStructure.string([DDataStructure.positive()]);
		// @ts-expect-error string structures cannot add number constraints.
		DDataStructure.string().addConstraint(DDataStructure.positive());
	});
});
