import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("lazy", () => {
	it("creates a lazy structure from a deferred structure getter", () => {
		const getStructure = vi.fn(
			() => DDataStructure.string(),
		);
		const structure = DDataStructure.lazy(getStructure);
		const success = structure.check("value");
		const failure = structure.check(123);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.LazyStructure<string, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
		expect(structure.is("value")).toBe(true);
		expect(getStructure).toHaveBeenCalledTimes(1);
	});

	it("can be used inside nested object, array and union helpers", () => {
		const structure = DDataStructure.object({
			node: DDataStructure.object({
				id: DDataStructure.union([
					DDataStructure.number(),
					DDataStructure.lazy(() => DDataStructure.literal("anonymous")),
				]),
				tags: DDataStructure.array(
					DDataStructure.lazy(() => DDataStructure.string()),
				),
			}),
		});
		const input = {
			node: {
				id: "anonymous",
				tags: ["admin", "member"],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly node: {
					readonly id: number | "anonymous";
					readonly tags: readonly string[];
				};
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
		expect(structure.is({
			node: {
				id: "anonymous",
				tags: ["admin", 123],
			},
		})).toBe(false);
	});

	it("can describe recursive runtime structures", () => {
		interface Tree {
			readonly value: string;
			readonly children: readonly Tree[];
		}

		const TreeStructure: DDataStructure.Structure<Tree> = DDataStructure.object({
			value: DDataStructure.string(),
			children: DDataStructure.array(
				DDataStructure.lazy(() => TreeStructure),
			),
		}).contract();

		const input = {
			value: "root",
			children: [
				{
					value: "child",
					children: [],
				},
			],
		};

		expect(TreeStructure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				TreeStructure.check({
					value: "root",
					children: [
						{
							value: 123,
							children: [],
						},
					],
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "children.[array: 0].value",
		});
	});

	it("keeps direct and added refine constraints coherent", () => {
		const directStructure = DDataStructure.lazy(
			() => DDataStructure.string(),
			[
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
			],
		);
		const addedStructure = DDataStructure.lazy(
			() => DDataStructure.string(),
		).addConstraint(
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
			DDataStructure.LazyStructure<
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

		// @ts-expect-error lazy string structures cannot receive number constraints.
		DDataStructure.lazy(() => DDataStructure.string(), [DDataStructure.positive()]);
		// @ts-expect-error lazy string structures cannot add number constraints.
		DDataStructure.lazy(() => DDataStructure.string()).addConstraint(DDataStructure.positive());
	});
});
