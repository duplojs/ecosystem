import { DModeling, DPattern, pipe, type ExpectType } from "@scripts";

describe("matchWithEntityOtherwise", () => {
	interface User extends DModeling.Entity<"User"> {
		name: string;
	}

	interface Admin extends DModeling.Entity<"Admin"> {
		permissions: readonly string[];
	}

	type Input = User | Admin;

	it("should match a handled entity and narrow both callbacks", () => {
		const input = DModeling.entityKind.addTo({
			name: "Alice",
		}, "User") as Input;

		const result = DPattern.matchWithEntityOtherwise(input, {
			User: (entity) => {
				type check = ExpectType<
					typeof entity,
					User,
					"strict"
				>;

				return entity.name;
			},
		}, (entity) => {
			type check = ExpectType<
				typeof entity,
				Admin,
				"strict"
			>;

			return entity.permissions.length;
		});

		expect(result).toBe("Alice");

		type check = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should delegate an unhandled entity in pipe", () => {
		const input = DModeling.entityKind.addTo({
			permissions: ["read"],
		}, "Admin") as Input;

		const result = pipe(
			input,
			DPattern.matchWithEntityOtherwise({
				User: (entity) => {
					type check = ExpectType<
						typeof entity,
						User,
						"strict"
					>;

					return entity.name;
				},
			}, (entity) => {
				type check = ExpectType<
					typeof entity,
					Admin,
					"strict"
				>;

				return entity.permissions.length;
			}),
		);

		expect(result).toBe(1);

		type check = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should reject matcher keys outside the entity names", () => {
		const input = DModeling.entityKind.addTo({
			name: "Alice",
		}, "User") as Input;

		DPattern.matchWithEntityOtherwise(
			input,
			// @ts-expect-error matcher cannot contain unknown entity cases
			{
				User: () => "Alice",
				Unexpected: () => false,
			},
			() => 1,
		);

		expect(true).toBe(true);
	});
});
