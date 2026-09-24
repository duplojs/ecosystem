import { DDataStructure, DModeling, type ExpectType } from "@scripts";

describe("createEntityNamespace", () => {
	it("creates consistently prefixed modeling helpers", () => {
		const namespace = DModeling.createEntityNamespace("User");
		const name = namespace.createNewType("Name", DDataStructure.string());
		const entity = namespace.createEntity(() => ({ name }));

		type _CheckName = ExpectType<
			typeof name,
			DModeling.NewTypeStructure<"UserName", string, readonly []>,
			"strict"
		>;
		type _CheckEntity = ExpectType<
			typeof entity,
			DModeling.EntityStructure<
				"User",
				{ readonly name: string & DModeling.NewType<"UserName"> }
			>,
			"strict"
		>;

		expect(namespace.name).toBe("User");
		expect(name.name).toBe("UserName");
		expect(entity.name).toBe("User");
	});
});
