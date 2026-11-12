
import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";
import type * as DString from "@scripts/string";

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

		type check = DCommon.ExpectType<
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
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				Success,
				"strict"
			>;

			expect(input.value).toBe(42);
		} else {
			type _CheckInput = DCommon.ExpectType<
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

		const result = DCommon.pipe(
			input,
			DCommon.when(
				DModeling.hasTagValue(["success"]),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
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

	describe("ObjectTagWithGroup", () => {
		interface UserGroup extends DModeling.ObjectTagGroup<"user", {
			readonly id: number;
			readonly name: string & DString.MinCharacters<3>;
		}> {}

		interface AccountGroup extends DModeling.ObjectTagGroup<"account", {
			readonly id: number;
			readonly active?: boolean;
		}> {}

		interface CreationGroup extends DModeling.ObjectTagGroup<"creation"> {}

		it("adds a single group and its properties to a tag", () => {
			interface Pending extends DModeling.ObjectTagWithGroup<"pending", UserGroup> {
				readonly attempts: number;
			}

			const input = DModeling.taggedObject<Pending>("[user]pending", {
				id: 1,
				name: DCommon.infer("Jane"),
				attempts: 0,
			});
			const tag = DModeling.getTagValue(input);

			expect(input).toStrictEqual({
				id: 1,
				name: "Jane",
				attempts: 0,
				[DModeling.objectTagKind.runTimeKey]: "[user]pending",
			});
			expect(DModeling.hasTagGroup(input, "user")).toBe(true);

			type _CheckInput = DCommon.ExpectType<typeof input, Pending, "strict">;
			type _CheckTag = DCommon.ExpectType<typeof tag, "[user]pending", "strict">;
			type _CheckName = DCommon.ExpectType<typeof input.name, string & DString.MinCharacters<3>, "strict">;
		});

		it("combines properties and preserves the order of multiple readonly groups", () => {
			type Pending = DModeling.ObjectTagWithGroup<"pending", readonly [UserGroup, AccountGroup, CreationGroup]>;
			const input = DModeling.taggedObject<Pending>("[user][account][creation]pending", {
				id: 1,
				name: DCommon.infer("Jane"),
			});
			const tag = DModeling.getTagValue(input);

			expect(tag).toBe("[user][account][creation]pending");
			expect(input.id).toBe(1);
			expect(input.name).toBe("Jane");
			expect(input.active).toBeUndefined();
			expect(DModeling.hasTagGroup(input, "user")).toBe(true);
			expect(DModeling.hasTagGroup(input, "account")).toBe(true);
			expect(DModeling.hasTagGroup(input, "creation")).toBe(true);

			type _CheckTag = DCommon.ExpectType<typeof tag, "[user][account][creation]pending", "strict">;
			type _CheckId = DCommon.ExpectType<typeof input.id, number, "strict">;
			type _CheckActive = DCommon.ExpectType<typeof input.active, boolean | undefined, "strict">;
		});

		it("groups tags without requiring common properties", () => {
			interface Created extends DModeling.ObjectTagWithGroup<"created", CreationGroup> {
				readonly id: number;
			}

			interface Failed extends DModeling.ObjectTagWithGroup<"failed", CreationGroup> {
				readonly reason: string;
			}

			const created = DModeling.taggedObject<Created>("[creation]created", { id: 1 });
			const failed = DModeling.taggedObject<Failed>("[creation]failed", { reason: "missing" });
			const input: readonly (Created | Failed)[] = [created, failed];
			const result = DCommon.pipe(input, DArray.filter(DModeling.hasTagGroup("creation")));

			expect(result).toStrictEqual([created, failed]);

			type _CheckResult = DCommon.ExpectType<typeof result, readonly (Created | Failed)[], "strict">;
		});

		it("keeps the original tag when the group tuple is empty", () => {
			type Ready = DModeling.ObjectTagWithGroup<"ready", readonly []>;
			const input = DModeling.taggedObject<Ready>("ready", {});
			const tag = DModeling.getTagValue(input);

			expect(tag).toBe("ready");

			type _CheckTag = DCommon.ExpectType<typeof tag, "ready", "strict">;
		});

		it("accepts grouped tags in factories and structures", () => {
			interface Pending extends DModeling.ObjectTagWithGroup<"pending", readonly [UserGroup, AccountGroup]> {}

			const object = DModeling.taggedObject<Pending>("[user][account]pending", {
				id: 1,
				name: DCommon.infer("Jane"),
				active: true,
			});
			const factory = DModeling.createTaggedObjectFactory<Pending>("[user][account]pending");
			const structure = DModeling.createTaggedObject<Pending>("[user][account]pending")({
				id: DDataStructure.number(),
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
				active: DDataStructure.optional(DDataStructure.boolean()),
			});
			const result = factory({
				id: 1,
				name: DCommon.infer("Jane"),
				active: true,
			});

			expect(result).toStrictEqual(object);
			expect(structure.name).toBe("[user][account]pending");
			expect(DEither.unwrapByInformationOrThrow(structure.check(result), "check-success")).toStrictEqual(result);
			expect(DModeling.hasTagValue(result, "[user][account]pending")).toBe(true);
			expect(DModeling.hasTagGroup(result, "account")).toBe(true);

			type _CheckResult = DCommon.ExpectType<typeof result, Pending, "strict">;
			type _CheckStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof structure>, Pending, "strict">;
		});

		it("requires declared groups and the complete tag in group order", () => {
			type Pending = DModeling.ObjectTagWithGroup<"pending", UserGroup>;
			type MultipleGroups = DModeling.ObjectTagWithGroup<"pending", readonly [UserGroup, AccountGroup]>;

			// @ts-expect-error A group must be declared with ObjectTagGroup.
			type _InvalidGroup = DModeling.ObjectTagWithGroup<"pending", "user">;
			// @ts-expect-error Each group must be declared with ObjectTagGroup.
			type _InvalidGroups = DModeling.ObjectTagWithGroup<"pending", readonly [UserGroup, "account"]>;
			// @ts-expect-error A group name must be a string.
			type _InvalidName = DModeling.ObjectTagGroup<42>;
			const name: Pending["name"] = DCommon.infer("Jane");
			const properties = {
				id: 1,
				name,
			};

			// @ts-expect-error The tag must include the declared group.
			DModeling.taggedObject<Pending>("pending", properties);
			// @ts-expect-error Every declared group must appear in the tag.
			DModeling.taggedObject<MultipleGroups>("[user]pending", properties);
			// @ts-expect-error The tag must preserve the declared group order.
			DModeling.taggedObject<MultipleGroups>("[account][user]pending", properties);
		});

		it("requires the properties and constraints inherited from groups", () => {
			type Pending = DModeling.ObjectTagWithGroup<"pending", readonly [UserGroup, AccountGroup]>;
			const unconstrainedProperties = {
				id: 1,
				name: "Jane",
			};

			// @ts-expect-error Group properties must be objects.
			type _InvalidProperties = DModeling.ObjectTagGroup<"user", string>;
			// @ts-expect-error The id property inherited from the group is required.
			DModeling.taggedObject<Pending>("[user][account]pending", { name: DCommon.infer("Jane") });
			// @ts-expect-error The inherited name property must carry the group constraint.
			DModeling.taggedObject<Pending>("[user][account]pending", unconstrainedProperties);
		});
	});

	describe("hasTagGroup", () => {
		interface UserGroup extends DModeling.ObjectTagGroup<"user"> {}
		interface CreatedGroup extends DModeling.ObjectTagGroup<"created"> {}
		interface DeletedGroup extends DModeling.ObjectTagGroup<"deleted"> {}
		interface OrderGroup extends DModeling.ObjectTagGroup<"order"> {}

		interface UserCreated extends DModeling.ObjectTagWithGroup<"event", readonly [UserGroup, CreatedGroup]> {
			readonly id: 1;
		}

		interface UserDeleted extends DModeling.ObjectTagWithGroup<"event", readonly [DeletedGroup, UserGroup]> {
			readonly id: 2;
		}

		interface OrderCreated extends DModeling.ObjectTagWithGroup<"event", readonly [OrderGroup, CreatedGroup]> {
			readonly id: 3;
		}

		type Event = UserCreated | UserDeleted | OrderCreated;

		it.each([
			{
				input: DModeling.taggedObject<UserCreated>("[user][created]event", { id: 1 }) as Event,
				expected: true,
			},
			{
				input: DModeling.taggedObject<UserDeleted>("[deleted][user]event", { id: 2 }) as Event,
				expected: true,
			},
			{
				input: DModeling.taggedObject<OrderCreated>("[order][created]event", { id: 3 }) as Event,
				expected: false,
			},
		])("checks a declared group in $input", ({ input, expected }) => {
			const result = DModeling.hasTagGroup(input, "user");

			expect(result).toBe(expected);

			type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
		});

		it("narrows both branches of a tagged union", () => {
			const input = DModeling.taggedObject<UserCreated>("[user][created]event", { id: 1 }) as Event;

			if (DModeling.hasTagGroup(input, "user")) {
				type _CheckInput = DCommon.ExpectType<typeof input, UserCreated | UserDeleted, "strict">;

				expect(input.id).toBe(1);
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, OrderCreated, "strict">;

				expect.fail("the user group should match");
			}
		});

		it("infers groups and narrows in a pipe", () => {
			const input = DModeling.taggedObject<OrderCreated>("[order][created]event", { id: 3 }) as Event;
			const result = DCommon.pipe(
				input,
				DCommon.when(
					DModeling.hasTagGroup("created"),
					(value) => {
						type _CheckValue = DCommon.ExpectType<typeof value, UserCreated | OrderCreated, "strict">;

						return value.id;
					},
				),
			);

			expect(result).toBe(3);

			type _CheckResult = DCommon.ExpectType<typeof result, 1 | 3 | UserDeleted, "strict">;
		});

		it("matches any of the selected groups", () => {
			const input = DModeling.taggedObject<UserCreated>("[user][created]event", { id: 1 }) as Event;

			if (DModeling.hasTagGroup(input, ["order", "user"])) {
				type _CheckInput = DCommon.ExpectType<typeof input, Event, "strict">;

				expect(input.id).toBe(1);
			} else {
				expect.fail("one of the selected groups should match");
			}

			expect(DModeling.hasTagGroup(input, ["order", "deleted"])).toBe(false);
			expect(DModeling.hasTagGroup(input, [])).toBe(false);
		});

		it("narrows a selection of groups in a pipe", () => {
			const input = DModeling.taggedObject<UserDeleted>("[deleted][user]event", { id: 2 }) as Event;
			const result = DCommon.pipe(
				input,
				DCommon.when(
					DModeling.hasTagGroup(["deleted", "order"]),
					(value) => {
						type _CheckValue = DCommon.ExpectType<typeof value, UserDeleted | OrderCreated, "strict">;

						return value.id;
					},
				),
			);

			expect(result).toBe(2);

			type _CheckResult = DCommon.ExpectType<typeof result, 2 | 3 | UserCreated, "strict">;
		});

		it("filters a tagged union by group", () => {
			const userCreated = DModeling.taggedObject<UserCreated>("[user][created]event", { id: 1 });
			const userDeleted = DModeling.taggedObject<UserDeleted>("[deleted][user]event", { id: 2 });
			const orderCreated = DModeling.taggedObject<OrderCreated>("[order][created]event", { id: 3 });
			const input: readonly Event[] = [userCreated, orderCreated, userDeleted];
			const result = DCommon.pipe(
				input,
				DArray.filter(DModeling.hasTagGroup("user")),
			);

			expect(result).toStrictEqual([userCreated, userDeleted]);

			type _CheckResult = DCommon.ExpectType<typeof result, readonly (UserCreated | UserDeleted)[], "strict">;
		});

		it("only extracts variants containing the exact group", () => {
			interface SuperUserGroup extends DModeling.ObjectTagGroup<"super-user"> {}
			interface SuperUser extends DModeling.ObjectTagWithGroup<"event", SuperUserGroup> {
				readonly id: 4;
			}

			const input = DModeling.taggedObject<SuperUser>("[super-user]event", { id: 4 }) as Event | SuperUser;

			if (DModeling.hasTagGroup(input, "user")) {
				type _CheckInput = DCommon.ExpectType<typeof input, UserCreated | UserDeleted, "strict">;

				expect.fail("the super-user group should not match user");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, OrderCreated | SuperUser, "strict">;

				expect(input.id).toBe(4);
			}
		});

		it("keeps ungrouped variants in the negative branch of a mixed union", () => {
			interface Ungrouped extends DModeling.ObjectTag<"event"> {
				readonly reason: string;
			}

			const input = DModeling.taggedObject<Ungrouped>("event", { reason: "ungrouped" }) as Event | Ungrouped;

			if (DModeling.hasTagGroup(input, "user")) {
				type _CheckInput = DCommon.ExpectType<typeof input, UserCreated | UserDeleted, "strict">;

				expect.fail("an ungrouped variant should not match");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, OrderCreated | Ungrouped, "strict">;

				expect(input).toStrictEqual(DModeling.taggedObject<Ungrouped>("event", { reason: "ungrouped" }));
			}
		});

		it("rejects group selection when no group can be inferred", () => {
			const ungrouped = DModeling.taggedObject<DModeling.ObjectTag<"event">>("event", {});
			const broad = ungrouped as DModeling.ObjectTag;
			const empty = DModeling.taggedObject<DModeling.ObjectTagWithGroup<"ready", readonly []>>("ready", {});

			// @ts-expect-error An ungrouped tag has no available groups.
			DModeling.hasTagGroup(ungrouped, "event");
			// @ts-expect-error An ungrouped tag also has no available groups in a pipe.
			DCommon.pipe(ungrouped, DModeling.hasTagGroup("user"));
			// @ts-expect-error A broad string tag does not establish any group membership.
			DModeling.hasTagGroup(broad, "user");
			// @ts-expect-error A broad string tag also has no inferred groups in a pipe.
			DCommon.pipe(broad, DModeling.hasTagGroup("user"));
			// @ts-expect-error An empty group tuple does not introduce any available groups.
			DModeling.hasTagGroup(empty, "user");
		});

		it("only accepts groups present in the input tag types", () => {
			const input = DModeling.taggedObject<UserCreated>("[user][created]event", { id: 1 }) as Event;

			// @ts-expect-error This group does not occur in the input union.
			DModeling.hasTagGroup(input, "missing");
			// @ts-expect-error The tag value outside brackets is not a group.
			DModeling.hasTagGroup(input, "event");
			// @ts-expect-error Groups are supplied without their brackets.
			DModeling.hasTagGroup(input, "[user]");
			// @ts-expect-error Every selected group must occur in the input union.
			DModeling.hasTagGroup(input, ["user", "missing"]);
			// @ts-expect-error The group must also exist when used in a pipe.
			DCommon.pipe(input, DModeling.hasTagGroup("missing"));
		});
	});

	describe("createTaggedObjectFactory", () => {
		it("creates tagged objects with the declared type and preserves the properties", () => {
			interface UserCreated extends DModeling.ObjectTag<"user-created"> {
				readonly name: string;
				readonly profile: { readonly score: number };
				readonly active?: boolean;
			}

			const createUserCreated = DModeling.createTaggedObjectFactory<UserCreated>("user-created");
			const properties = {
				name: "Jane",
				profile: { score: 12 },
				active: true,
			};
			const result = createUserCreated(properties);
			const secondResult = createUserCreated(properties);

			type _CheckResult = DCommon.ExpectType<
				typeof result,
				UserCreated,
				"strict"
			>;

			expect(result).toStrictEqual({
				name: "Jane",
				profile: { score: 12 },
				active: true,
				[DModeling.objectTagKind.runTimeKey]: "user-created",
			});
			expect(result).not.toBe(properties);
			expect(secondResult).toStrictEqual(result);
			expect(secondResult).not.toBe(result);
			expect(result.profile).toBe(properties.profile);
			expect(properties).toStrictEqual({
				name: "Jane",
				profile: { score: 12 },
				active: true,
			});
		});

		it("preserves constraints and optional properties in a pipe", () => {
			interface UserCreated extends DModeling.ObjectTag<"user-created"> {
				readonly name: string & DString.MinCharacters<3>;
				readonly active?: boolean;
			}

			const name: UserCreated["name"] = DCommon.infer("Jane");
			const result = DCommon.pipe(
				{ name },
				DModeling.createTaggedObjectFactory<UserCreated>("user-created"),
			);

			type _CheckResult = DCommon.ExpectType<
				typeof result,
				UserCreated,
				"strict"
			>;

			expect(result).toStrictEqual({
				name: "Jane",
				[DModeling.objectTagKind.runTimeKey]: "user-created",
			});
		});

		it("creates tagged objects without properties", () => {
			const createReady = DModeling.createTaggedObjectFactory<DModeling.ObjectTag<"ready">>("ready");
			const result = createReady({});

			type _CheckResult = DCommon.ExpectType<
				typeof result,
				DModeling.ObjectTag<"ready">,
				"strict"
			>;

			expect(result).toStrictEqual({
				[DModeling.objectTagKind.runTimeKey]: "ready",
			});
		});

		it("requires a single explicit tagged object type and matching properties", () => {
			interface UserCreated extends DModeling.ObjectTag<"user-created"> {
				readonly name: string & DString.MinCharacters<3>;
				readonly score: number;
			}

			// @ts-expect-error The tagged object type must be explicitly provided.
			DModeling.createTaggedObjectFactory("user-created");

			// @ts-expect-error The type must be a tagged object.
			DModeling.createTaggedObjectFactory<{ name: string }>("user-created");

			// @ts-expect-error The tag must match the declared tagged object.
			DModeling.createTaggedObjectFactory<UserCreated>("user-updated");

			// @ts-expect-error A factory cannot create a union of tagged objects.
			DModeling.createTaggedObjectFactory<UserCreated | DModeling.ObjectTag<"ready">>("user-created");

			const createUserCreated = DModeling.createTaggedObjectFactory<UserCreated>("user-created");

			// @ts-expect-error The score property is required.
			createUserCreated({ name: DCommon.infer("Jane") });

			createUserCreated({
				// @ts-expect-error The name must carry the declared constraint.
				name: "Jane",
				score: 12,
			});

			createUserCreated({
				name: DCommon.infer("Jane"),
				// @ts-expect-error The score must be a number.
				score: "12",
			});

			createUserCreated({
				name: DCommon.infer("Jane"),
				score: 12,
				// @ts-expect-error Unknown properties are not part of the declared tagged object.
				active: true,
			});
		});
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

		type _CheckStructure = DCommon.ExpectType<
			typeof structure,
			DModeling.TaggedObjectStructure<UserCreated>,
			"strict"
		>;
		type _CheckStructureValue = DCommon.ExpectType<
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

		type check1 = DCommon.ExpectType<
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

		type check2 = DCommon.ExpectType<
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
