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

	it("create fact without event and run then", () => {
		interface UserCreatedFact extends DModeling.Fact<
			"UserCreated",
			{
				name: Name;
				age: Age;
			}
		> {}

		const UserCreatedFact = DModeling.createFact<
			UserCreatedFact,
			typeof User
		>("UserCreated")(
			({
				applyFact,
			}) => (
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => applyFact(
				User.new({
					Name: payload.name,
					Age: payload.age,
				}),
				payload,
			),
		);

		type check1 = DCommon.ExpectType<
			typeof UserCreatedFact,
			DModeling.FactHandler<
				"UserCreated",
				User,
				DModeling.GetFactPayload<UserCreatedFact>,
				never,
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

	it("create fact with events from a tuple and resolve them", async() => {
		interface UserCreatedFact extends DModeling.Fact<
			"UserCreated",
			{
				name: Name;
				age: Age;
			}
		> {}

		const UserCreatedFact = DModeling.createFact<
			UserCreatedFact,
			typeof User,
			["sendNotification", "updateStatistics"]
		>("UserCreated", true)(
			({
				applyFact,
			}) => (
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => applyFact(
				User.new({
					Name: payload.name,
					Age: payload.age,
				}),
				payload,
			),
		);

		const payload = {
			name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
			age: DEither.unwrapRightOrThrow(Age.map(24)),
		};
		const resolver = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(payload),
			"fact-result-UserCreated",
		);
		const sendNotification = vi.fn(() => undefined);
		const updateStatistics = vi.fn(() => undefined);

		const resolveResult = await resolver.resolve({
			sendNotification,
			updateStatistics,
		});
		type checkResolveResult = DCommon.ExpectType<
			typeof resolveResult,
			DEither.Right<
				"fact-resolve-success",
				& User
				& UserCreatedFact
			>,
			"strict"
		>;

		expect(sendNotification).toHaveBeenCalledOnce();
		expect(updateStatistics).toHaveBeenCalledOnce();

		const runAndResolveResolver = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(payload),
			"fact-result-UserCreated",
		);
		const theFunction = vi.fn(() => undefined);
		const sendNotificationAfterRun = vi.fn(() => undefined);
		const updateStatisticsAfterRun = vi.fn(() => undefined);

		const runAndResolveResult = await runAndResolveResolver.runAndResolve(
			theFunction,
			{
				sendNotification: sendNotificationAfterRun,
				updateStatistics: updateStatisticsAfterRun,
			},
		);
		type checkRunAndResolveResult = DCommon.ExpectType<
			typeof runAndResolveResult,
			DEither.Right<
				"fact-resolve-success",
				& User
				& UserCreatedFact
			>,
			"strict"
		>;

		expect(theFunction).toHaveBeenCalledOnce();
		expect(sendNotificationAfterRun).toHaveBeenCalledOnce();
		expect(updateStatisticsAfterRun).toHaveBeenCalledOnce();

		const runFailureResolver = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(payload),
			"fact-result-UserCreated",
		);
		const runError = DEither.left("run-error", "run failed");
		const failingFunction = vi.fn(() => runError);
		const skippedNotification = vi.fn(() => undefined);
		const skippedStatistics = vi.fn(() => undefined);
		const handleRunFailure = vi.fn(() => "run failure handled" as const);

		const runFailureResult = await runFailureResolver.runAndResolve(
			failingFunction,
			{
				sendNotification: skippedNotification,
				updateStatistics: skippedStatistics,
			},
			(result) => {
				type check = DCommon.ExpectType<
					typeof result,
					DEither.Left<"run-error", "run failed">,
					"strict"
				>;
				return handleRunFailure();
			},
		);
		type checkRunFailureResult = DCommon.ExpectType<
			typeof runFailureResult,
			| DEither.Left<"fact-resolve-error", "run failure handled">
			| DEither.Right<
				"fact-resolve-success",
				& User
				& UserCreatedFact
			>,
			"strict"
		>;

		expect(failingFunction).toHaveBeenCalledOnce();
		expect(skippedNotification).not.toHaveBeenCalled();
		expect(skippedStatistics).not.toHaveBeenCalled();
		expect(handleRunFailure).toHaveBeenCalledOnce();
		expect(runFailureResult).toStrictEqual(
			DEither.left("fact-resolve-error", "run failure handled"),
		);

		const resolveFailureResolver = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(payload),
			"fact-result-UserCreated",
		);
		const eventError = DEither.left("event-error", "notification failed");
		const failingNotification = vi.fn(() => eventError);
		const skippedStatisticsAfterEventFailure = vi.fn(() => undefined);
		const handleEventFailure = vi.fn(() => "event failure handled" as const);

		const resolveFailureResult = await resolveFailureResolver.resolve(
			{
				sendNotification: failingNotification,
				updateStatistics: skippedStatisticsAfterEventFailure,
			},
			(result) => {
				type check = DCommon.ExpectType<
					typeof result,
					DEither.Left<"event-error", "notification failed">,
					"strict"
				>;
				return handleEventFailure();
			},
		);
		type checkResolveFailureResult = DCommon.ExpectType<
			typeof resolveFailureResult,
			| DEither.Left<"fact-resolve-error", "event failure handled">
			| DEither.Right<
				"fact-resolve-success",
				& User
				& UserCreatedFact
			>,
			"strict"
		>;

		expect(failingNotification).toHaveBeenCalledOnce();
		expect(skippedStatisticsAfterEventFailure).not.toHaveBeenCalled();
		expect(handleEventFailure).toHaveBeenCalledOnce();
		expect(resolveFailureResult).toStrictEqual(
			DEither.left("fact-resolve-error", "event failure handled"),
		);
	});

	it("create fact with events defined from external function contracts", async() => {
		interface UserCreatedFact extends DModeling.Fact<
			"UserCreated",
			{
				name: Name;
				age: Age;
			}
		> {}

		const UserCreatedFact = DModeling.createFact<
			UserCreatedFact,
			typeof User,
			{
				sendNotification: typeof sendUserCreatedNotification;
				updateStatistics: typeof updateUserStatistics;
			}
		>("UserCreated", true)(
			({
				applyFact,
			}) => (
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => applyFact(
				User.new({
					Name: payload.name,
					Age: payload.age,
				}),
				payload,
			),
		);

		const sendUserCreatedNotification = vi.fn(
			(
				entity: User & UserCreatedFact,
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => {
				expect(entity.Name).toBe(payload.name);

				return undefined;
			},
		);
		const updateUserStatistics = vi.fn(
			(
				entity: User & UserCreatedFact,
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => {
				expect(entity.Age).toBe(payload.age);

				return undefined;
			},
		);

		const payload: DModeling.GetFactPayload<UserCreatedFact> = {
			name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
			age: DEither.unwrapRightOrThrow(Age.map(24)),
		};
		const resolver = DEither.unwrapByInformationOrThrow(
			UserCreatedFact.run(payload),
			"fact-result-UserCreated",
		);

		const resolveResult = await resolver.resolve({
			sendNotification: sendUserCreatedNotification,
			updateStatistics: updateUserStatistics,
		});

		type checkResolveResult = DCommon.ExpectType<
			typeof resolveResult,
			DEither.Right<
				"fact-resolve-success",
				& User
				& UserCreatedFact
			>,
			"strict"
		>;

		expect(sendUserCreatedNotification).toHaveBeenCalledOnce();
		expect(updateUserStatistics).toHaveBeenCalledOnce();
	});

	it("apply fact through pipe while preserving input type and value", () => {
		interface UserRenamedFact extends DModeling.Fact<
			"UserRenamed",
			{
				previousName: Name;
			}
		> {}

		const UserRenamedFact = DModeling.createFact<
			UserRenamedFact,
			typeof User
		>("UserRenamed")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: DModeling.GetFactPayload<UserRenamedFact>,
			) => DCommon.pipe(
				entity,
				applyFact(payload),
			),
		);
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

		expect(UserRenamedFact.has(entityWithFact)).toBe(true);
		expect(UserRenamedFact.getPayload(entityWithFact)).toBe(payload);
	});

	it("replace the previous fact in both type and runtime", () => {
		interface UserCreatedFact extends DModeling.Fact<
			"UserCreated",
			{
				origin: "registration";
			}
		> {}
		interface UserActivatedFact extends DModeling.Fact<
			"UserActivated",
			{
				origin: "confirmation";
			}
		> {}

		const UserCreatedFact = DModeling.createFact<
			UserCreatedFact,
			typeof User
		>("UserCreated")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: DModeling.GetFactPayload<UserCreatedFact>,
			) => applyFact(entity, payload),
		);
		const UserActivatedFact = DModeling.createFact<
			UserActivatedFact,
			typeof User
		>("UserActivated")(
			({ applyFact }) => <GenericEntity extends User>(
				entity: GenericEntity,
				payload: DModeling.GetFactPayload<UserActivatedFact>,
			) => applyFact(entity, payload),
		);
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

	it("keep async execution order and awaited error types coherent", async() => {
		interface UserImportedFact extends DModeling.Fact<
			"UserImported",
			{
				source: "csv";
			}
		> {}

		const UserImportedFact = DModeling.createFact<
			UserImportedFact,
			typeof User,
			["prepare", "persist", "notify"]
		>("UserImported", true)(
			({ applyFact }) => (
				payload: DModeling.GetFactPayload<UserImportedFact>,
			) => applyFact(
				User.new({
					Name: DEither.unwrapRightOrThrow(Name.map("mathcovax")),
					Age: DEither.unwrapRightOrThrow(Age.map(24)),
				}),
				payload,
			),
		);
		const payload = { source: "csv" as const };

		const successOrder: string[] = [];
		const successResolver = DEither.unwrapByInformationOrThrow(
			UserImportedFact.run(payload),
			"fact-result-UserImported",
		);
		const successResult = await successResolver.runAndResolve(
			async() => {
				await Promise.resolve();
				successOrder.push("run");

				return DEither.right("run-success");
			},
			{
				prepare: async() => {
					await Promise.resolve();
					successOrder.push("prepare");

					return undefined;
				},
				persist: () => {
					successOrder.push("persist");

					return DEither.right("persist-success");
				},
				notify: () => {
					successOrder.push("notify");

					return undefined;
				},
			},
		);
		type checkSuccessResult = DCommon.ExpectType<
			typeof successResult,
			DEither.Right<
				"fact-resolve-success",
				& User
				& UserImportedFact
			>,
			"strict"
		>;

		expect(successOrder).toStrictEqual([
			"run",
			"prepare",
			"persist",
			"notify",
		]);
		expect(
			DEither.unwrapByInformationOrThrow(
				successResult,
				"fact-resolve-success",
			),
		).toMatchObject({
			[DModeling.factKind.runTimeKey]: {
				name: "UserImported",
				payload,
			},
		});

		const runFailureResolver = DEither.unwrapByInformationOrThrow(
			UserImportedFact.run(payload),
			"fact-result-UserImported",
		);
		const skippedAfterRunFailure = vi.fn(() => undefined);
		const runFailureResult = await runFailureResolver.runAndResolve(
			async() => {
				await Promise.resolve();

				return DEither.left("async-run-error", "run failed" as const);
			},
			{
				prepare: skippedAfterRunFailure,
				persist: skippedAfterRunFailure,
				notify: skippedAfterRunFailure,
			},
			async(result, entity, receivedPayload) => {
				await Promise.resolve();

				type checkResult = DCommon.ExpectType<
					typeof result,
					DEither.Left<"async-run-error", "run failed">,
					"strict"
				>;

				expect(UserImportedFact.has(entity)).toBe(true);
				expect(receivedPayload).toBe(payload);

				return "async run failure handled" as const;
			},
		);
		type checkRunFailureResult = DCommon.ExpectType<
			typeof runFailureResult,
			| DEither.Left<"fact-resolve-error", "async run failure handled">
			| DEither.Right<
				"fact-resolve-success",
				& User
				& UserImportedFact
			>,
			"strict"
		>;

		expect(skippedAfterRunFailure).not.toHaveBeenCalled();
		expect(runFailureResult).toStrictEqual(
			DEither.left("fact-resolve-error", "async run failure handled"),
		);

		const eventFailureOrder: string[] = [];
		const eventFailureResolver = DEither.unwrapByInformationOrThrow(
			UserImportedFact.run(payload),
			"fact-result-UserImported",
		);
		const skippedAfterEventFailure = vi.fn(() => undefined);
		const eventFailureResult = await eventFailureResolver.resolve(
			{
				prepare: async() => {
					await Promise.resolve();
					eventFailureOrder.push("prepare");

					return undefined;
				},
				persist: async() => {
					await Promise.resolve();
					eventFailureOrder.push("persist");

					return DEither.left(
						"async-event-error",
						"persist failed" as const,
					);
				},
				notify: skippedAfterEventFailure,
			},
			async(result, entity, receivedPayload) => {
				await Promise.resolve();

				type checkResult = DCommon.ExpectType<
					typeof result,
					DEither.Left<"async-event-error", "persist failed">,
					"strict"
				>;

				eventFailureOrder.push("whenLeft");
				expect(UserImportedFact.has(entity)).toBe(true);
				expect(receivedPayload).toBe(payload);

				return "async event failure handled" as const;
			},
		);
		type checkEventFailureResult = DCommon.ExpectType<
			typeof eventFailureResult,
			| DEither.Left<"fact-resolve-error", "async event failure handled">
			| DEither.Right<
				"fact-resolve-success",
				& User
				& UserImportedFact
			>,
			"strict"
		>;

		expect(eventFailureOrder).toStrictEqual([
			"prepare",
			"persist",
			"whenLeft",
		]);
		expect(skippedAfterEventFailure).not.toHaveBeenCalled();
		expect(eventFailureResult).toStrictEqual(
			DEither.left("fact-resolve-error", "async event failure handled"),
		);
	});
});
