import * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithFact", () => {
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

	it("should call the matching handler with the narrowed fact in classic form", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserDeleted",
				payload: { reason: "requested" },
			},
		) as Input;

		const result = DPattern.matchWithFact(input, {
			UserCreated: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					UserCreated,
					"strict"
				>;

				return DModeling.factKind.getValue(value).payload.name;
			},
			UserDeleted: (value) => {
				type check = DCommon.ExpectType<
					typeof value,
					UserDeleted,
					"strict"
				>;

				return DModeling.factKind.getValue(value).payload.reason.length;
			},
		});

		expect(result).toBe(9);

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("passes the fact and its payload to the handler in both forms", () => {
		const payload = { name: "Alice" };
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserCreated" as const,
				payload,
			},
		);
		const directHandler = vi.fn();
		const curriedHandler = vi.fn();

		const direct = DPattern.matchWithFact(input, {
			UserCreated: (value, factPayload) => {
				type _CheckValue = DCommon.ExpectType<typeof value, typeof input, "strict">;
				type _CheckPayload = DCommon.ExpectType<typeof factPayload, { name: string }, "strict">;

				directHandler(value, factPayload);
				return factPayload.name;
			},
		});
		const curried = DCommon.pipe(
			input,
			DPattern.matchWithFact({
				UserCreated: (value, factPayload) => {
					type _CheckValue = DCommon.ExpectType<typeof value, typeof input, "strict">;
					type _CheckPayload = DCommon.ExpectType<typeof factPayload, { name: string }, "strict">;

					curriedHandler(value, factPayload);
					return factPayload.name;
				},
			}),
		);

		type _CheckDirect = DCommon.ExpectType<typeof direct, string, "strict">;
		type _CheckCurried = DCommon.ExpectType<typeof curried, string, "strict">;

		expect(direct).toBe("Alice");
		expect(curried).toBe("Alice");
		expect(directHandler).toHaveBeenCalledExactlyOnceWith(input, payload);
		expect(curriedHandler).toHaveBeenCalledExactlyOnceWith(input, payload);
	});

	it("should work in pipe with the curried form", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserCreated",
				payload: { name: "Alice" },
			},
		) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithFact({
				UserCreated: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						UserCreated,
						"strict"
					>;

					return DModeling.factKind.getValue(value).payload.name;
				},
				UserDeleted: (value) => {
					type check = DCommon.ExpectType<
						typeof value,
						UserDeleted,
						"strict"
					>;

					return DModeling.factKind.getValue(value).payload.reason.length;
				},
			}),
		);

		expect(result).toBe("Alice");

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should infer facts passed directly to curried functions in pipe", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserDeleted",
				payload: { reason: "requested" },
			},
		) as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithFact({
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
				UserDeleted: DObject.transformProperties({
					id: (value) => {
						type check = DCommon.ExpectType<
							typeof value,
							string,
							"strict"
						>;

						return value.length > 0;
					},
				}),
			}),
		);

		expect(result.id).toBe(true);

		type check = DCommon.ExpectType<
			typeof result,
			TransformedInput,
			"strict"
		>;
	});

	it("should reject non-specific facts in classic and curried forms", () => {
		const input = DModeling.factKind.addTo({}, {
			name: "UserCreated",
			payload: {},
		}) as DModeling.Fact;

		// @ts-expect-error input must be a fact literal union
		DPattern.matchWithFact(input, {
			UserCreated: () => "Alice",
		});

		DCommon.pipe(
			// @ts-expect-error curried matcher only accepts its fact literal keys
			input,
			DPattern.matchWithFact({
				UserCreated: () => "Alice",
			}),
		);

		expect(true).toBe(true);
	});

	it("should reject matchers with missing or additional keys", () => {
		const input = DModeling.factKind.addTo(
			DModeling.entityKind.addTo({ id: "user-id" }, "User"),
			{
				name: "UserCreated",
				payload: { name: "Alice" },
			},
		) as Input;

		// @ts-expect-error matcher must handle every fact name
		DPattern.matchWithFact(input, {
			UserCreated: () => "Alice",
		});

		// @ts-expect-error matcher cannot declare keys outside the fact names
		DPattern.matchWithFact(input, {
			UserCreated: () => "Alice",
			UserDeleted: () => 9,
			Unexpected: () => false,
		});

		DCommon.pipe(
			input,
			// @ts-expect-error curried matcher must handle every piped fact name
			DPattern.matchWithFact({
				UserCreated: () => "Alice",
			}),
		);
		DCommon.pipe(
			input,
			DPattern.matchWithFact(
				// @ts-expect-error curried matcher cannot declare keys outside its fact names
				{
					UserCreated: () => "Alice",
					UserDeleted: () => 9,
					Unexpected: () => false,
				},
			),
		);

		expect(true).toBe(true);
	});
});
