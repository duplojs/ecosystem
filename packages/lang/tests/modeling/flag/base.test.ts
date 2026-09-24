import { DDataStructure, DModeling, pipe, type ExpectType } from "@scripts";

describe("createFlag", () => {
	const name = DModeling.createNewType("UserName", DDataStructure.string());
	const userStructure = DModeling.createEntity("User", () => ({ name }));
	const userName = "Jane" as DDataStructure.StructureValue<typeof name>;

	it("creates a flag handler for an entity and value structure", () => {
		const valueStructure = DDataStructure.string();
		interface UserRole extends DModeling.Flag<
			"UserRole",
			string
		> {}
		const flag = DModeling.createFlag<
			UserRole,
			typeof userStructure
		>("UserRole");

		expect(flag.name).toBe("UserRole");
	});

	it("appends and reads a flag without mutating the entity", () => {
		interface UserRole extends DModeling.Flag<
			"UserRole",
			string
		> {}
		const flag = DModeling.createFlag<
			UserRole,
			typeof userStructure
		>("UserRole");
		const entity = userStructure.new({ name: userName });
		const result = flag.append(entity, "admin");

		expect(result).not.toBe(entity);
		expect(flag.has(entity)).toBe(false);
		expect(flag.has(result)).toBe(true);
		expect(flag.getPayload(result)).toBe("admin");
	});

	it("appends a flag in a pipe", () => {
		interface UserRole extends DModeling.Flag<
			"UserRole",
			string
		> {}
		const flag = DModeling.createFlag<
			UserRole,
			typeof userStructure
		>("UserRole");
		const entity = userStructure.new({ name: userName });
		const result = pipe(entity, flag.append("reader"));

		expect(flag.getPayload(result)).toBe("reader");
	});

	it("preserves other flags when appending a new one", () => {
		interface UserRole extends DModeling.Flag<
			"UserRole",
			string
		> {}
		const role = DModeling.createFlag<
			UserRole,
			typeof userStructure
		>("UserRole");
		interface UserState extends DModeling.Flag<
			"UserState",
			unknown
		> {}
		const state = DModeling.createFlag<
			UserState,
			typeof userStructure
		>("UserState");
		const entity = userStructure.new({ name: userName });
		const result = state.append(role.append(entity, "admin"), {});

		expect(role.getPayload(result)).toBe("admin");
		expect(state.getPayload(result)).toStrictEqual({});
	});

	it("narrows an entity union to the flagged branch", () => {
		interface UserRole extends DModeling.Flag<
			"UserRole",
			string
		> {}
		const flag = DModeling.createFlag<
			UserRole,
			typeof userStructure
		>("UserRole");
		const entity = userStructure.new({ name: userName });
		const input: typeof entity | ReturnType<typeof flag.append<typeof entity, "admin">> = entity;

		if (flag.has(input)) {
			type _CheckNarrowed = ExpectType<
				typeof input,
				Extract<typeof input, DModeling.Flag<"UserRole", "admin">>,
				"strict"
			>;
		}
	});
});
