import { DCommon, DDataStructure, DEither, DModeling, type DString, pipe, when, type ExpectType } from "@scripts";

describe("objectTag", () => {
	it("create object tag from interface", () => {
		interface TaggedObjectOne extends DModeling.ObjectTag<"superObject1"> {
			prop1: string & DString.MinCharacters<1>;
			prop2: number;
		}

		interface TaggedObjectTwo extends DModeling.ObjectTag<"superObject2"> {
			prop3: string;
			prop4: number;
		}

		const taggedObject = DModeling.taggedObject<
			| TaggedObjectOne
			| TaggedObjectTwo
		>(
			"superObject1",
			{
				prop1: DCommon.infer("test"),
				prop2: 12,
			},
		);

		type check = ExpectType<
			typeof taggedObject,
			| TaggedObjectOne
			| TaggedObjectTwo,
			"strict"
		>;

		expect(taggedObject).toStrictEqual({
			prop1: "test",
			prop2: 12,
			[DModeling.objectTagKind.runTimeKey]: "superObject1",
		});
	});

	it("create object tag from declaration", () => {
		interface TaggedObjectOne extends DModeling.ObjectTag<"superObject1"> {
			prop1: string;
			prop2: number;
		}

		interface TaggedObjectTwo extends DModeling.ObjectTag<"superObject2"> {
			prop3: string;
			prop4: number;
		}

		const taggedObject: (
			| TaggedObjectOne
			| TaggedObjectTwo
		) = DModeling.taggedObject(
			"superObject1",
			{
				prop1: "test",
				prop2: 12,
			},
		);

		expect(taggedObject).toStrictEqual({
			prop1: "test",
			prop2: 12,
			[DModeling.objectTagKind.runTimeKey]: "superObject1",
		});
	});

	it("get tag value", () => {
		const taggedObject = DModeling.taggedObject(
			"superObject",
			{
				prop1: "test",
				prop2: 12,
			},
		);

		expect(DModeling.getTagValue(taggedObject)).toBe("superObject");
	});

	it("checks tag value directly", () => {
		const taggedObject = DModeling.taggedObject(
			"success",
			{
				value: 42,
			},
		);

		expect(DModeling.hasTagValue(taggedObject, "success")).toBe(true);
		expect(
			DModeling.hasTagValue(taggedObject, ["pending", "success"] as never),
		).toBe(true);
		expect(DModeling.hasTagValue(taggedObject, "failure" as never)).toBe(false);
		expect(DModeling.hasTagValue({ value: 42 }, "success" as never)).toBe(false);
	});

	it("narrows tagged object by tag value", () => {
		interface Success extends DModeling.ObjectTag<"success"> {
			value: 42;
		}

		interface Failure extends DModeling.ObjectTag<"failure"> {
			error: "missing";
		}

		const input = (
			Math.random() > -1
				? DModeling.taggedObject(
					"success",
					{
						value: 42 as const,
					},
				)
				: DModeling.taggedObject(
					"failure",
					{
						error: "missing" as const,
					},
				)
		) as Success | Failure;

		if (DModeling.hasTagValue(input, "success")) {
			type _CheckInput = ExpectType<
				typeof input,
				Success,
				"strict"
			>;

			expect(input.value).toBe(42);
		} else {
			type _CheckInput = ExpectType<
				typeof input,
				Failure,
				"strict"
			>;

			expect(input.error).toBe("missing");
		}
	});

	it("checks tag value in pipe and narrows the input", () => {
		interface Success extends DModeling.ObjectTag<"success"> {
			value: 42;
		}

		interface Failure extends DModeling.ObjectTag<"failure"> {
			error: "missing";
		}

		const input = DModeling.taggedObject(
			"success",
			{
				value: 42 as const,
			},
		) as Success | Failure;

		const result = pipe(
			input,
			when(
				DModeling.hasTagValue(["success"]),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						Success,
						"strict"
					>;

					return value.value;
				},
			),
		);

		expect(result).toBe(42);
	});

	it("creates a tagged object structure helper from an existing interface", () => {
		interface UserCreated extends DModeling.ObjectTag<"user-created"> {
			readonly name: string & DString.MinCharacters<3>;
			readonly score: number;
		}

		const structure = DModeling.createTaggedObject<UserCreated>(
			"user-created",
		)({
			name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			score: DDataStructure.number(),
		});
		const value = DModeling.taggedObject<UserCreated>(
			"user-created",
			{
				name: DCommon.infer("Jane"),
				score: 12,
			},
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.TaggedObjectStructure<UserCreated>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			UserCreated,
			"strict"
		>;

		expect(structure.name).toBe("user-created");
		expect(structure.check(value)).toStrictEqual(
			DEither.right("check-success", value),
		);

		const taggedObjectUserCreatedFromInterface = DModeling.createTaggedObject<UserCreated>(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
				score: DDataStructure.number(),
			},
		);

		expect(taggedObjectUserCreatedFromInterface.name).toBe("user-created");
		expect(taggedObjectUserCreatedFromInterface.check(value)).toStrictEqual(
			DEither.right("check-success", value),
		);

		type check1 = ExpectType<
			DDataStructure.StructureValue<typeof taggedObjectUserCreatedFromInterface>,
			UserCreated,
			"strict"
		>;

		const taggedObjectUserCreatedFromInference = DModeling.createTaggedObject(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
				score: DDataStructure.number(),
			},
		);

		expect(taggedObjectUserCreatedFromInference.name).toBe("user-created");
		expect(taggedObjectUserCreatedFromInference.check(value)).toStrictEqual(
			DEither.right("check-success", value),
		);

		type check2 = ExpectType<
			DDataStructure.StructureValue<typeof taggedObjectUserCreatedFromInference>,
			(
				& DModeling.ObjectTag<"user-created">
				& {
					readonly name: string & DString.MinCharacters<3>;
					readonly score: number;
				}
			),
			"strict"
		>;
	});

	it("requires createTaggedObject helper shape to match the declared tagged object", () => {
		interface UserCreated extends DModeling.ObjectTag<"user-created"> {
			readonly name: string & DString.MinCharacters<3>;
			readonly score: number | string;
		}

		const createUserCreated = DModeling.createTaggedObject<UserCreated>(
			"user-created",
		);

		createUserCreated({
			name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			score: DDataStructure.union([
				DDataStructure.number(),
				DDataStructure.string(),
			]),
		});

		// @ts-expect-error The score property is missing from the helper shape.
		createUserCreated({
			name: DDataStructure.string([DDataStructure.minCharacters(3)]),
		});

		createUserCreated({
			// @ts-expect-error The helper shape does not provide the declared constraint.
			name: DDataStructure.string(),
			score: DDataStructure.union([
				DDataStructure.number(),
				DDataStructure.string(),
			]),
		});

		// @ts-expect-error The helper shape declares an unknown property.
		createUserCreated({
			name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			score: DDataStructure.union([
				DDataStructure.number(),
				DDataStructure.string(),
			]),
			active: DDataStructure.boolean(),
		});

		// @ts-expect-error shape not match.
		createUserCreated({
			name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			score: DDataStructure.number(),
		});
	});
});
