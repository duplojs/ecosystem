import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";

describe("createFact", () => {
	const Name = DModeling.createNewType(
		"Name",
		DDataStructure.string(),
		[
			DDataStructure.trimmed(),
			DDataStructure.maxCharacters(20),
			DDataStructure.minCharacters(5),
		],
	);
	type Name = DDataStructure.StructureValue<typeof Name>;

	const Age = DModeling.createNewType(
		"Age",
		DDataStructure.number(),
		[
			DDataStructure.positive(),
			DDataStructure.integer(),
		],
	);
	type Age = DDataStructure.StructureValue<typeof Age>;

	const User = DModeling.createEntity(
		"User",
		() => ({
			Name,
			Age,
		}),
	);
	type User = DDataStructure.StructureValue<typeof User>;

	it("create fact and run it", () => {
		const UserCreatedFact = DModeling.createFact<
			"UserCreated",
			{
				name: Name;
				age: Age;
			},
			typeof User
		>("UserCreated")(
			({
				applyFact,
			}) => (
				payload: {
					name: Name;
					age: Age;
				},
			) => applyFact(
				User.new({
					Name: payload.name,
					Age: payload.age,
				}),
				payload,
			),
		);
		type UserCreatedFact = DModeling.GetFact<typeof UserCreatedFact>;

		type checkFact = DCommon.ExpectType<
			UserCreatedFact,
			DModeling.Fact<"UserCreated", {
				name: Name;
				age: Age;
			}>,
			"strict"
		>;

		// @ts-expect-error the runtime name must match the declared name
		DModeling.createFact<"UserCreated", DModeling.GetFactPayload<UserCreatedFact>, typeof User>("OtherFact");
		// @ts-expect-error the fact name must start with an uppercase letter
		DModeling.createFact<"userCreated", DModeling.GetFactPayload<UserCreatedFact>, typeof User>("userCreated");

		type check1 = DCommon.ExpectType<
			typeof UserCreatedFact,
			DModeling.FactHandler<
				"UserCreated",
				User,
				DModeling.GetFactPayload<UserCreatedFact>,
				(payload: DModeling.GetFactPayload<UserCreatedFact>) => DEither.Right<
					"fact-result-UserCreated",
					& User
					& UserCreatedFact
				>
			>,
			"strict"
		>;

		expect(UserCreatedFact.name).toBe("UserCreated");

		const result = UserCreatedFact.run({
			name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
			age: DEither.unwrapRightOrThrow(Age.map(24)),
		});

		type check = DCommon.ExpectType<
			typeof result,
			DEither.Right<
				"fact-result-UserCreated",
				& User
				& DModeling.Fact<"UserCreated", DModeling.GetFactPayload<UserCreatedFact>>
			>,
			"strict"
		>;

		expect(
			DEither.unwrapByInformationOrThrow(
				result,
				"fact-result-UserCreated",
			),
		).toStrictEqual({
			[DModeling.entityKind.runTimeKey]: "User",
			[DModeling.factKind.runTimeKey]: {
				name: "UserCreated",
				payload: {
					name: "mathcovax",
					age: 24,
				},
			},
			Name: "mathcovax",
			Age: 24,
		});
	});

	it("apply fact through pipe while preserving input type and value", () => {
		const UserRenamedFact = DModeling.createFact<
			"UserRenamed",
			{
				previousName: Name;
			},
			typeof User
		>("UserRenamed")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: { previousName: Name },
			) => DCommon.pipe(
				entity,
				applyFact(payload),
			),
		);
		type UserRenamedFact = DModeling.GetFact<typeof UserRenamedFact>;
		const entity = User.new({
			Name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
			Age: DEither.unwrapRightOrThrow(Age.map(24)),
		});
		const payload = {
			previousName: entity.Name,
		};

		const result = UserRenamedFact.run(entity, payload);
		type checkResult = DCommon.ExpectType<
			typeof result,
			DEither.Right<
				"fact-result-UserRenamed",
				& typeof entity
				& UserRenamedFact
			>,
			"strict"
		>;

		const entityWithFact = DEither.unwrapByInformationOrThrow(
			result,
			"fact-result-UserRenamed",
		);

		expect(UserRenamedFact.has(entity)).toBe(false);
		if (UserRenamedFact.has(entityWithFact)) {
			type checkEntity = DCommon.ExpectType<
				typeof entityWithFact,
				& typeof entity
				& UserRenamedFact,
				"strict"
			>;
		}
		expect(UserRenamedFact.has(entityWithFact)).toBe(true);
		expect(UserRenamedFact.getPayload(entityWithFact)).toBe(payload);
	});

	it("replace the previous fact in both type and runtime", () => {
		const UserCreatedFact = DModeling.createFact<
			"UserCreated",
			{
				origin: "registration";
			},
			typeof User
		>("UserCreated")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: { origin: "registration" },
			) => applyFact(entity, payload),
		);
		type UserCreatedFact = DModeling.GetFact<typeof UserCreatedFact>;
		const UserActivatedFact = DModeling.createFact<
			"UserActivated",
			{
				origin: "confirmation";
			},
			typeof User
		>("UserActivated")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: { origin: "confirmation" },
			) => applyFact(entity, payload),
		);
		type UserActivatedFact = DModeling.GetFact<typeof UserActivatedFact>;
		const entity: User = User.new({
			Name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
			Age: DEither.unwrapRightOrThrow(Age.map(24)),
		});
		const entityWithCreatedFact = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(entity, { origin: "registration" }),
			"fact-result-UserCreated",
		);

		const result = UserActivatedFact.run(
			entityWithCreatedFact,
			{ origin: "confirmation" },
		);
		type checkResult = DCommon.ExpectType<
			typeof result,
			DEither.Right<
				"fact-result-UserActivated",
				& User
				& UserActivatedFact
			>,
			"strict"
		>;

		const entityWithActivatedFact = DEither.unwrapByInformationOrThrow(
			result,
			"fact-result-UserActivated",
		);

		expect(UserCreatedFact.has(entityWithActivatedFact)).toBe(false);
		expect(UserActivatedFact.has(entityWithActivatedFact)).toBe(true);
		expect(UserActivatedFact.getPayload(entityWithActivatedFact)).toStrictEqual({
			origin: "confirmation",
		});
	});
});
