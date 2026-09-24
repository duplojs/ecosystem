import * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithEntityOtherwise", () => {
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

	it("should match a handled entity and narrow both callbacks", () => {
		const input = DModeling.entityKind.addTo({
			id: "user-id",
			name: "Alice",
		}, "User") as Input;

		const result = DPattern.matchWithEntityOtherwise(input, {
			User: (entity) => {
				type check = DCommon.ExpectType<
					typeof entity,
					User,
					"strict"
				>;

				return entity.name;
			},
		}, (entity) => {
			type check = DCommon.ExpectType<
				typeof entity,
				Admin,
				"strict"
			>;

			return entity.permissions.length;
		});

		expect(result).toBe("Alice");

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should delegate an unhandled entity in pipe", () => {
		const input = DModeling.entityKind.addTo({
			id: "admin-id",
			permissions: ["read"],
		}, "Admin") as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithEntityOtherwise({
				User: (entity) => {
					type check = DCommon.ExpectType<
						typeof entity,
						User,
						"strict"
					>;

					return entity.name;
				},
			}, (entity) => {
				type check = DCommon.ExpectType<
					typeof entity,
					Admin,
					"strict"
				>;

				return entity.permissions.length;
			}),
		);

		expect(result).toBe(1);

		type check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("should infer handled and unhandled entities passed directly to curried functions in pipe", () => {
		const input = DModeling.entityKind.addTo({
			id: "admin-id",
			permissions: ["read"],
		}, "Admin") as Input;

		const result = DCommon.pipe(
			input,
			DPattern.matchWithEntityOtherwise(
				{
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

	it("should reject matcher keys outside the entity names", () => {
		const input = DModeling.entityKind.addTo({
			id: "user-id",
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
