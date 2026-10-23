import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import type * as DString from "@scripts/string";

describe("nullable", () => {
	it("keeps structure constraints when adding null to a non-union structure", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.string([DDataStructure.email()]),
		);

		type _CheckStructure = DCommon.ExpectType<
			typeof structure,
			DDataStructure.UnionStructure<
				| string & DString.Email
				| null,
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			| string & DString.Email
			| null,
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(null)).toStrictEqual(
			DEither.right("check-success", null),
		);
		expect(structure.check("jane@example.com")).toStrictEqual(
			DEither.right("check-success", "jane@example.com"),
		);
		expect(structure.is("not-an-email")).toBe(false);
	});

	it("does not add null twice inside an existing union", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.union([
				DDataStructure.null(),
				DDataStructure.string(),
			]),
		);

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | null,
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(2);
		expect(structure.check(null)).toStrictEqual(
			DEither.right("check-success", null),
		);
	});

	it("removes union constraints and keeps the initial value when adding null to a union", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.union(
				[DDataStructure.string()],
				[DDataStructure.email()],
			),
		);

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | null,
			"strict"
		>;
		type _CheckConstraints = DCommon.ExpectType<
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
		const structure = DDataStructure.nullable(
			DDataStructure.string(),
		).addConstraint(
			DDataStructure.refine(
				(data): data is string => {
					type check = DCommon.ExpectType<
						typeof data,
						string | null,
						"strict"
					>;

					return data !== null;
				},
			),
		);

		type _CheckConstraints = DCommon.ExpectType<
			typeof structure,
			DDataStructure.Structure<
				string | null,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<string | null, string>]
				>
			>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		// @ts-expect-error nullable string structures cannot add constraints that ignore null.
		DDataStructure.nullable(DDataStructure.string()).addConstraint(DDataStructure.email());
	});
});
