import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("include", () => {
	it("creates a typed constraint", () => {
		const constraint = DDataStructure.include("duplo");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.IncludeConstraint<"duplo">,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual({ searchString: "duplo" });
		expect(constraint.executeCheck("jsduplojs")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("javascript")).toBe(DDataStructure.ErrorSymbol);
	});

	it("infers and validates a nested string structure", () => {
		const constraint = DDataStructure.include("duplo");
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				name: DDataStructure.string([constraint]),
			}),
		});
		const input = { user: { name: "jsduplojs" } };
		const result = DEither.unwrapByInformationOrThrow(structure.check(input), "check-success");

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{ readonly user: { readonly name: `${string}duplo${string}` } },
			"strict"
		>;
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly user: { readonly name: `${string}duplo${string}` } },
			"strict"
		>;

		expect(result).toStrictEqual(input);
		const error = DEither.unwrapByInformationOrThrow(
			structure.check({ user: { name: "javascript" } }),
			"check-error",
		);
		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]).toMatchObject({
			data: "javascript",
			path: "user.name",
		});
		expect((error.issues[0] as DDataStructure.Issue).getSubSource?.()).toBe(constraint);
	});

	it("narrows unknown values only after successful validation", () => {
		const structure = DDataStructure.string([DDataStructure.include("duplo")]);
		const input: unknown = "jsduplojs";

		if (structure.is(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				`${string}duplo${string}`,
				"strict"
			>;

			expect(input).toBe("jsduplojs");
		} else {
			expect.unreachable();
		}

		expect(structure.is(42)).toBe(false);
		expect(structure.is("javascript")).toBe(false);
	});
});
