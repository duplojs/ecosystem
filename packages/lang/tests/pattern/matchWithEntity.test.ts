import { DModeling, DPattern, pipe, type ExpectType } from "@scripts";

describe("matchWithEntity", () => {
	interface User extends DModeling.Entity<"User"> {
		name: string;
	}

	interface Admin extends DModeling.Entity<"Admin"> {
		permissions: readonly string[];
	}

	type Input = User | Admin;

	it("should call the matching handler with the narrowed entity in classic form", () => {
		const input = DModeling.entityKind.addTo({
			permissions: ["read"],
		}, "Admin") as Input;

		const result = DPattern.matchWithEntity(input, {
			User: (entity) => {
				type check = ExpectType<
					typeof entity,
					User,
					"strict"
				>;

				return entity.name;
			},
			Admin: (entity) => {
				type check = ExpectType<
					typeof entity,
					Admin,
					"strict"
				>;

				return entity.permissions.length;
			},
		});

		expect(result).toBe(1);

		type check = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should work in pipe with the curried form", () => {
		const input = DModeling.entityKind.addTo({
			name: "Alice",
		}, "User") as Input;

		const result = pipe(
			input,
			DPattern.matchWithEntity({
				User: (entity) => {
					type check = ExpectType<
						typeof entity,
						User,
						"strict"
					>;

					return entity.name;
				},
				Admin: (entity) => {
					type check = ExpectType<
						typeof entity,
						Admin,
						"strict"
					>;

					return entity.permissions.length;
				},
			}),
		);

		expect(result).toBe("Alice");

		type check = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should reject non-specific entities in classic and curried forms", () => {
		const input = DModeling.entityKind.addTo({}, "User") as DModeling.Entity;

		// @ts-expect-error input must be an entity literal union
		DPattern.matchWithEntity(input, {
			User: () => "Alice",
		});

		pipe(
			// @ts-expect-error curried matcher only accepts its entity literal keys
			input,
			DPattern.matchWithEntity({
				User: () => "Alice",
			}),
		);

		expect(true).toBe(true);
	});

	it("should reject matchers with missing or additional keys", () => {
		const input = DModeling.entityKind.addTo({
			name: "Alice",
		}, "User") as Input;

		// @ts-expect-error matcher must handle every entity name
		DPattern.matchWithEntity(input, {
			User: () => "Alice",
		});

		// @ts-expect-error matcher cannot declare keys outside the entity names
		DPattern.matchWithEntity(input, {
			User: () => "Alice",
			Admin: () => 1,
			Unexpected: () => false,
		});

		pipe(
			input,
			// @ts-expect-error curried matcher must handle every piped entity name
			DPattern.matchWithEntity({
				User: () => "Alice",
			}),
		);
		pipe(
			input,
			DPattern.matchWithEntity(
				// @ts-expect-error curried matcher cannot declare keys outside its entity names
				{
					User: () => "Alice",
					Admin: () => 1,
					Unexpected: () => false,
				},
			),
		);

		expect(true).toBe(true);
	});
});
