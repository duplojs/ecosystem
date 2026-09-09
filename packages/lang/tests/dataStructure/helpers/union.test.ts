import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("union", () => {
	it("creates a union structure from helper structures", () => {
		const structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.number(),
			DDataStructure.boolean(),
		]);
		const success = structure.check("value");
		const failure = structure.check(null);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.UnionStructure<string | number | boolean, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | number | boolean,
			"strict"
		>;

		expect(structure.definition.values.value).toHaveLength(3);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: null,
				path: "(union: 0)",
			},
			{
				data: null,
				path: "(union: 1)",
			},
			{
				data: null,
				path: "(union: 2)",
			},
			{
				data: null,
				path: "",
			},
		]);
	});

	it("can combine literal object and array helpers", () => {
		const structure = DDataStructure.union([
			DDataStructure.object({
				kind: DDataStructure.literal("user"),
				email: DDataStructure.string([DDataStructure.email()]),
				active: DDataStructure.boolean(),
			}),
			DDataStructure.object({
				kind: DDataStructure.literal("batch"),
				values: DDataStructure.array(DDataStructure.union([
					DDataStructure.number(),
					DDataStructure.literal("skip"),
				])),
			}),
		]);
		const userInput = {
			kind: "user",
			email: "jane@example.com",
			active: true,
		} as const;
		const batchInput = {
			kind: "batch",
			values: [1, "skip", 2],
		} as const;

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			| {
				readonly kind: "user";
				readonly email: string & DString.Email;
				readonly active: boolean;
			}
			| {
				readonly kind: "batch";
				readonly values: readonly (number | "skip")[];
			},
			"strict"
		>;

		expect(structure.check(userInput)).toStrictEqual(
			DEither.right("check-success", userInput),
		);
		expect(structure.check(batchInput)).toStrictEqual(
			DEither.right("check-success", batchInput),
		);
		expect(structure.is({
			kind: "batch",
			values: [1, "invalid"],
		})).toBe(false);
	});

	it("can be used inside nested object and array helpers", () => {
		const structure = DDataStructure.object({
			events: DDataStructure.array(DDataStructure.object({
				id: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
				]),
				payload: DDataStructure.union([
					DDataStructure.null(),
					DDataStructure.object({
						count: DDataStructure.number(),
						flags: DDataStructure.array(DDataStructure.boolean()),
					}),
				]),
			})),
		});
		const input = {
			events: [
				{
					id: "evt-1",
					payload: null,
				},
				{
					id: 2,
					payload: {
						count: 3,
						flags: [true, false],
					},
				},
			],
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly events: readonly {
					readonly id: string | number;
					readonly payload:
						| null
						| {
							readonly count: number;
							readonly flags: readonly boolean[];
						};
				}[];
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});

	it("keeps direct and added refine constraints coherent", () => {
		const directStructure = DDataStructure.union(
			[
				DDataStructure.string(),
				DDataStructure.number(),
			],
			[
				DDataStructure.refine(
					(data): data is string => {
						type check = ExpectType<
							typeof data,
							string | number,
							"strict"
						>;

						return typeof data === "string";
					},
				),
			],
		);
		const addedStructure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.number(),
		]).addConstraint(
			DDataStructure.refine(
				(data): data is string => {
					type check = ExpectType<
						typeof data,
						string | number,
						"strict"
					>;

					return typeof data === "string";
				},
			),
		);

		type _CheckDirectConstraints = ExpectType<
			typeof directStructure,
			DDataStructure.UnionStructure<
				string | number,
				readonly [DDataStructure.RefineConstraint<string | number, string>]
			>,
			"strict"
		>;
		type _CheckDirectValue = ExpectType<
			DDataStructure.StructureValue<typeof directStructure>,
			string,
			"strict"
		>;
		type _CheckAddedConstraints = ExpectType<
			typeof addedStructure,
			DDataStructure.Structure<
				string | number,
				DDataStructure.StructureDefinition<
					readonly [DDataStructure.RefineConstraint<string | number, string>]
				>
			>,
			"strict"
		>;
		type _CheckAddedValue = ExpectType<
			DDataStructure.StructureValue<typeof addedStructure>,
			string,
			"strict"
		>;

		const values = [
			DDataStructure.string(),
			DDataStructure.number(),
		] as const;
		const unrelatedBoolean = DDataStructure.refine((data: boolean) => data);

		// @ts-expect-error union structures cannot receive unrelated boolean constraints.
		DDataStructure.union(values, [unrelatedBoolean]);
		// @ts-expect-error union structures cannot add unrelated boolean constraints.
		DDataStructure.union(values).addConstraint(unrelatedBoolean);
	});
});
