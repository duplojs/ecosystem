import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DModeling from "@scripts/modeling";

describe("createFlag", () => {
	const name = DModeling.createNewType("UserName", DDataStructure.string());
	const userStructure = DModeling.createEntity("User", () => ({ name }));
	const userName = "Jane" as DDataStructure.StructureValue<typeof name>;

	it("creates a flag handler for an entity and value structure", () => {
		const flag = DModeling.createFlag<
			"UserRole",
			string,
			typeof userStructure
		>("UserRole");

		expect(flag.name).toBe("UserRole");

		type UserRole = DModeling.GetFlag<typeof flag>;
		type _CheckFlag = DCommon.ExpectType<
			UserRole,
			DModeling.Flag<"UserRole", string>,
			"strict"
		>;
		type _CheckHandler = DCommon.ExpectType<
			typeof flag,
			DModeling.FlagHandler<
				"UserRole",
				DDataStructure.StructureValue<typeof userStructure>,
				string
			>,
			"strict"
		>;

		// @ts-expect-error the runtime name must match the declared name
		DModeling.createFlag<"UserRole", string, typeof userStructure>("OtherRole");
		// @ts-expect-error the flag name must start with an uppercase letter
		DModeling.createFlag<"userRole", string, typeof userStructure>("userRole");
	});

	it("appends and reads a flag without mutating the entity", () => {
		const flag = DModeling.createFlag<
			"UserRole",
			string,
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
		const flag = DModeling.createFlag<
			"UserRole",
			string,
			typeof userStructure
		>("UserRole");
		const entity = userStructure.new({ name: userName });
		const result = DCommon.pipe(entity, flag.append("reader"));

		expect(flag.getPayload(result)).toBe("reader");
	});

	it("preserves other flags when appending a new one", () => {
		const role = DModeling.createFlag<
			"UserRole",
			string,
			typeof userStructure
		>("UserRole");
		const state = DModeling.createFlag<
			"UserState",
			unknown,
			typeof userStructure
		>("UserState");
		const entity = userStructure.new({ name: userName });
		const result = state.append(role.append(entity, "admin"), {});

		expect(role.getPayload(result)).toBe("admin");
		expect(state.getPayload(result)).toStrictEqual({});
	});

	it("narrows an entity union to the flagged branch", () => {
		const flag = DModeling.createFlag<
			"UserRole",
			string,
			typeof userStructure
		>("UserRole");
		const entity = userStructure.new({ name: userName });
		const input: typeof entity | ReturnType<typeof flag.append<typeof entity, "admin">> = entity;

		if (flag.has(input)) {
			type _CheckNarrowed = DCommon.ExpectType<
				typeof input,
				Extract<typeof input, DModeling.Flag<"UserRole", "admin">>,
				"strict"
			>;
		}
	});
});
