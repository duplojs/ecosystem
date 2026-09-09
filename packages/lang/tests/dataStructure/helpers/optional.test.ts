import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("optional", () => {
	it("keeps structure constraints when adding undefined to a non-union structure", () => {
		const structure = DDataStructure.optional(
			DDataStructure.string([DDataStructure.email()]),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.UnionStructure<
				| string & DString.Email
				| undefined,
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			| string & DString.Email
			| undefined,
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(undefined)).toStrictEqual(
			DEither.right("check-success", undefined),
		);
		expect(structure.check("jane@example.com")).toStrictEqual(
			DEither.right("check-success", "jane@example.com"),
		);
		expect(structure.is("not-an-email")).toBe(false);
	});

	it("does not add undefined twice inside an existing union", () => {
		const structure = DDataStructure.optional(
			DDataStructure.union([
				DDataStructure.undefined(),
				DDataStructure.string(),
			]),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | undefined,
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(2);
		expect(structure.check(undefined)).toStrictEqual(
			DEither.right("check-success", undefined),
		);
	});

	it("removes union constraints and keeps the initial value when adding undefined to a union", () => {
		const structure = DDataStructure.optional(
			DDataStructure.union(
				[DDataStructure.string()],
				[DDataStructure.email()],
			),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | undefined,
			"strict"
		>;
		type _CheckConstraints = ExpectType<
			typeof structure.definition.constraints,
			readonly [],
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check("not-an-email")).toStrictEqual(
			DEither.right("check-success", "not-an-email"),
		);
	});

	it("keeps added refine constraints coherent", () => {
		const structure = DDataStructure.optional(
			DDataStructure.string(),
		).addConstraint(
			DDataStructure.refine(
				(data): data is string => {
					type check = ExpectType<
						typeof data,
						string | undefined,
						"strict"
					>;

					return data !== undefined;
				},
			),
		);

		type _CheckConstraints = ExpectType<
			typeof structure,
			DDataStructure.Structure<
				string | undefined,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<string | undefined, string>]
				>
			>,
			"strict"
		>;
		type _CheckValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		// @ts-expect-error optional string structures cannot add constraints that ignore undefined.
		DDataStructure.optional(DDataStructure.string()).addConstraint(DDataStructure.email());
	});
});
