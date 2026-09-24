import * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithEntity", () => {
	interface User extends DModeling.Entity<"User"> {
		id: string;
		name: string;
	}

	interface Admin extends DModeling.Entity<"Admin"> {
		id: string;
		permissions: readonly string[];
	}

	type Input = User | Admin;
	type TransformedUser = DCommon.SimplifyTopLevel<
		& Omit<User, "id">
		& { id: number }
	>;
	type TransformedAdmin = DCommon.SimplifyTopLevel<
		& Omit<Admin, "id">
		& { id: boolean }
	>;
	type TransformedInput = TransformedUser | TransformedAdmin;

	it("should call the matching handler with the narrowed entity in classic form", () => {
		const input = DModeling.entityKind.addTo({
			id: "admin-id",
			permissions: ["read"],
		}, "Admin") as Input;

		const result = DPattern.matchWithEntity(input, {
			User: (entity) => {
				type check = DCommon.ExpectType<
					typeof entity,
					User,
					"strict"
				>;

				return entity.name;
			},
			Admin: (entity) => {
				type check = DCommon.ExpectType<
					typeof entity,
					Admin,
					"strict"
				>;

				return entity.permissions.length;
			},
		});

		expect(result).toBe(1);

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should work in pipe with the curried form", () => {
		const input = DModeling.entityKind.addTo({
			id: "user-id",
			name: "Alice",
		}, "User") as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithEntity({
				User: (entity) => {
					type check = DCommon.ExpectType<
						typeof entity,
						User,
						"strict"
					>;

					return entity.name;
				},
				Admin: (entity) => {
					type check = DCommon.ExpectType<
						typeof entity,
						Admin,
						"strict"
					>;

					return entity.permissions.length;
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

	it("should infer entities passed directly to curried functions in pipe", () => {
		const input = DModeling.entityKind.addTo({
			id: "admin-id",
			permissions: ["read"],
		}, "Admin") as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithEntity({
				User: DObject.transformProperties({
					id: (value) => {
						type check = DCommon.ExpectType<
							typeof value,
							string,
							"strict"
						>;

						return value.length;
					},
				}),
				Admin: DObject.transformProperties({
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

	it("should reject non-specific entities in classic and curried forms", () => {
		const input = DModeling.entityKind.addTo({}, "User") as DModeling.Entity;

		// @ts-expect-error input must be an entity literal union
		DPattern.matchWithEntity(input, {
			User: () => "Alice",
		});

		DCommon.pipe(
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
			id: "user-id",
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

		DCommon.pipe(
			input,
			// @ts-expect-error curried matcher must handle every piped entity name
			DPattern.matchWithEntity({
				User: () => "Alice",
			}),
		);
		DCommon.pipe(
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
