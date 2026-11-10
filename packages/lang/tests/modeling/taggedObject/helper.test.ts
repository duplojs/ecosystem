
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

	describe("createTagNameWithGroup", () => {
		it("infers a single group and the tag name as literals", () => {
			const result = DModeling.createTagNameWithGroup("pending", ["user"]);

			expect(result).toBe("[user]:pending");

			type _CheckResult = DCommon.ExpectType<typeof result, "[user]:pending", "strict">;
		});

		it("preserves the order of multiple readonly groups", () => {
			const groups = ["user", "account", "creation"] as const;
			const result = DModeling.createTagNameWithGroup("pending", groups);

			expect(result).toBe("[user][account][creation]:pending");
			expect(groups).toStrictEqual(["user", "account", "creation"]);

			type _CheckResult = DCommon.ExpectType<typeof result, "[user][account][creation]:pending", "strict">;
		});

		it("keeps the separator for an empty group tuple", () => {
			const result = DModeling.createTagNameWithGroup("ready", []);

			expect(result).toBe(":ready");

			type _CheckResult = DCommon.ExpectType<typeof result, ":ready", "strict">;
			type _CheckTag = DCommon.ExpectType<typeof result, DModeling.GetTagValue<DModeling.ObjectTagWithGroups<readonly [], "ready">>, "strict">;
		});

		it("accepts groups whose length is only known at runtime", () => {
			const groups: readonly string[] = ["user", "account"];
			const result = DModeling.createTagNameWithGroup("pending", groups);

			expect(result).toBe("[user][account]:pending");

			type _CheckResult = DCommon.ExpectType<typeof result, `${string}:pending`, "strict">;
			type _CheckTag = DCommon.ExpectType<typeof result, DModeling.GetTagValue<DModeling.ObjectTagWithGroups<readonly string[], "pending">>, "strict">;
		});

		it("preserves known groups when the tag name is dynamic", () => {
			const name = "pending" as string;
			const result = DModeling.createTagNameWithGroup(name, ["user"]);

			expect(result).toBe("[user]:pending");

			type _CheckResult = DCommon.ExpectType<typeof result, `[user]:${string}`, "strict">;
		});

		it("creates names accepted by the tagged object helpers", () => {
			interface Pending extends DModeling.ObjectTagWithGroups<readonly ["user", "account"], "pending"> {
				readonly id: number;
			}

			const name = DModeling.createTagNameWithGroup("pending", ["user", "account"]);
			const object = DModeling.taggedObject<Pending>(name, { id: 1 });
			const factory = DModeling.createTaggedObjectFactory<Pending>(name);
			const structure = DModeling.createTaggedObject<Pending>(name)({ id: DDataStructure.number() });
			const result = factory({ id: 1 });

			expect(result).toStrictEqual(object);
			expect(structure.name).toBe(name);
			expect(DModeling.getTagValue(result)).toBe(name);
			expect(DModeling.hasTagValue(result, name)).toBe(true);
			expect(DModeling.hasTagGroup(result, "account")).toBe(true);

			type _CheckName = DCommon.ExpectType<typeof name, DModeling.GetTagValue<Pending>, "strict">;
			type _CheckResult = DCommon.ExpectType<typeof result, Pending, "strict">;
		});

		it("requires string names and groups", () => {
			// @ts-expect-error The tag name must be a string.
			DModeling.createTagNameWithGroup(42, ["user"]);
			// @ts-expect-error Every group must be a string.
			DModeling.createTagNameWithGroup("pending", [42]);
		});
	});

	describe("hasTagGroup", () => {
		interface UserCreated extends DModeling.ObjectTagWithGroups<readonly ["user", "created"], "event"> {
			readonly id: 1;
		}

		interface UserDeleted extends DModeling.ObjectTagWithGroups<readonly ["deleted", "user"], "event"> {
			readonly id: 2;
		}

		interface OrderCreated extends DModeling.ObjectTagWithGroups<readonly ["order", "created"], "event"> {
			readonly id: 3;
		}

		type Event = UserCreated | UserDeleted | OrderCreated;

		it("formats multiple groups before the colon-separated status", () => {
			type Pending = DModeling.ObjectTagWithGroups<readonly ["user", "account", "creation"], "pending">;
			const input = DModeling.taggedObject<Pending>("[user][account][creation]:pending", {});
			const result = DModeling.getTagValue(input);

			expect(result).toBe("[user][account][creation]:pending");
			expect(DModeling.hasTagGroup(input, "user")).toBe(true);
			expect(DModeling.hasTagGroup(input, "account")).toBe(true);
			expect(DModeling.hasTagGroup(input, "creation")).toBe(true);

			type _CheckResult = DCommon.ExpectType<typeof result, "[user][account][creation]:pending", "strict">;
		});

		it.each([
			{
				tag: "[user][created]:event",
				group: "user",
				expected: true,
			},
			{
				tag: "[deleted][user]:event",
				group: "user",
				expected: true,
			},
			{
				tag: "[order][created]:event",
				group: "user",
				expected: false,
			},
			{
				tag: "user:event",
				group: "user",
				expected: false,
			},
			{
				tag: "(user)|event",
				group: "user",
				expected: false,
			},
			{
				tag: "[super-user]:event",
				group: "user",
				expected: false,
			},
			{
				tag: "[user-admin]:event",
				group: "user",
				expected: false,
			},
			{
				tag: "prefix[user]suffix",
				group: "user",
				expected: true,
			},
			{
				tag: "event:[user]",
				group: "user",
				expected: true,
			},
			{
				tag: "[user:event",
				group: "user",
				expected: false,
			},
			{
				tag: "[]:event",
				group: "",
				expected: true,
			},
			{
				tag: "[a.b]:event",
				group: "a.b",
				expected: true,
			},
		])("checks the exact group $group in $tag", ({ tag, group, expected }) => {
			const input = DModeling.taggedObject<DModeling.ObjectTag>(tag, {});
			const result = DModeling.hasTagGroup(input, group);

			expect(result).toBe(expected);

			type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
		});

		it("narrows both branches of a tagged union", () => {
			const input = DModeling.taggedObject<UserCreated>("[user][created]:event", { id: 1 }) as Event;

			if (DModeling.hasTagGroup(input, "user")) {
				type _CheckInput = DCommon.ExpectType<typeof input, UserCreated | UserDeleted, "strict">;

				expect(input.id).toBe(1);
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, OrderCreated, "strict">;

				expect.fail("the user group should match");
			}
		});

		it("infers groups and narrows in a pipe", () => {
			const input = DModeling.taggedObject<OrderCreated>("[order][created]:event", { id: 3 }) as Event;
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
			const input = DModeling.taggedObject<UserCreated>("[user][created]:event", { id: 1 }) as Event;

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
			const input = DModeling.taggedObject<UserDeleted>("[deleted][user]:event", { id: 2 }) as Event;
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
			const userCreated = DModeling.taggedObject<UserCreated>("[user][created]:event", { id: 1 });
			const userDeleted = DModeling.taggedObject<UserDeleted>("[deleted][user]:event", { id: 2 });
			const orderCreated = DModeling.taggedObject<OrderCreated>("[order][created]:event", { id: 3 });
			const input: readonly Event[] = [userCreated, orderCreated, userDeleted];
			const result = DCommon.pipe(
				input,
				DArray.filter(DModeling.hasTagGroup("user")),
			);

			expect(result).toStrictEqual([userCreated, userDeleted]);

			type _CheckResult = DCommon.ExpectType<typeof result, readonly (UserCreated | UserDeleted)[], "strict">;
		});

		it("only extracts variants containing the exact group", () => {
			interface SuperUser extends DModeling.ObjectTagWithGroups<readonly ["super-user"], "event"> {
				readonly id: 4;
			}

			const input = DModeling.taggedObject<SuperUser>("[super-user]:event", { id: 4 }) as Event | SuperUser;

			if (DModeling.hasTagGroup(input, "user")) {
				type _CheckInput = DCommon.ExpectType<typeof input, UserCreated | UserDeleted, "strict">;

				expect.fail("the super-user group should not match user");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, OrderCreated | SuperUser, "strict">;

				expect(input.id).toBe(4);
			}
		});

		it("only accepts groups present in the input tag types", () => {
			const input = DModeling.taggedObject<UserCreated>("[user][created]:event", { id: 1 }) as Event;

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
			const ungrouped = DModeling.taggedObject<DModeling.ObjectTag<"event">>("event", {});
			// @ts-expect-error An ungrouped tag has no available groups.
			DModeling.hasTagGroup(ungrouped, "event");
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
