import * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithFactOtherwise", () => {
	interface UserCreatedFact extends DModeling.Fact<
		"UserCreated",
		{ name: string }
	> {}

	interface UserDeletedFact extends DModeling.Fact<
		"UserDeleted",
		{ reason: string }
	> {}

	type UserCreated = (
		& DModeling.Entity<"User">
		& { id: string }
		& UserCreatedFact
	);

	type UserDeleted = (
		& DModeling.Entity<"User">
		& { id: string }
		& UserDeletedFact
	);

	type Input = UserCreated | UserDeleted;
	type TransformedUserCreated = DCommon.SimplifyTopLevel<
		& Omit<UserCreated, "id">
		& { id: number }
	>;
	type TransformedUserDeleted = DCommon.SimplifyTopLevel<
		& Omit<UserDeleted, "id">
		& { id: boolean }
	>;
	type TransformedInput = TransformedUserCreated | TransformedUserDeleted;

	it("should match a handled fact and narrow both callbacks", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserCreated",
				payload: { name: "Alice" },
			},
		) as Input;

		const result = DPattern.matchWithFactOtherwise(input, {
			UserCreated: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					UserCreated,
					"strict"
				>;

				return DModeling.factKind.getValue(value).payload.name;
			},
		}, (value) => {
			type check = DCommon.ExpectType<
				typeof value,
				UserDeleted,
				"strict"
			>;

			return DModeling.factKind.getValue(value).payload.reason.length;
		});

		expect(result).toBe("Alice");

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should delegate an unhandled fact in pipe", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserDeleted",
				payload: { reason: "requested" },
			},
		) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithFactOtherwise({
				UserCreated: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						UserCreated,
						"strict"
					>;

					return DModeling.factKind.getValue(value).payload.name;
				},
			}, (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					UserDeleted,
					"strict"
				>;

				return DModeling.factKind.getValue(value).payload.reason.length;
			}),
		);

		expect(result).toBe(9);

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should infer handled and unhandled facts passed directly to curried functions in pipe", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserDeleted",
				payload: { reason: "requested" },
			},
		) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithFactOtherwise(
				{
					UserCreated: DObject.transformProperties({
						id: (value) => {
							type check = DCommon.ExpectType<
								typeof value,
								string,
								"strict"
							>;

							return value.length;
						},
					}),
				},
				DObject.transformProperties({
					id: (value) => {
						type check = DCommon.ExpectType<
							typeof value,
							string,
							"strict"
						>;

						return value.length > 0;
					},
				}),
			),
		);

		expect(result.id).toBe(true);

		type check = DCommon.ExpectType<
			typeof result,
			TransformedInput,
			"strict"
		>;
	});

	it("should reject matcher keys outside the fact names", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserCreated",
				payload: { name: "Alice" },
			},
		) as Input;

		DPattern.matchWithFactOtherwise(
			input,
			// @ts-expect-error matcher cannot contain unknown fact cases
			{
				UserCreated: () => "Alice",
				Unexpected: () => false,
			},
			() => 9,
		);

		expect(true).toBe(true);
	});
});
