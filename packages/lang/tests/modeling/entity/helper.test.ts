import { DDataStructure, DEither, DModeling, type ExpectType } from "@scripts";

describe("createEntity", () => {
	it("creates an entity composed of new types", () => {
		const name = DModeling.createNewType("UserName", DDataStructure.string());
		const structure = DModeling.createEntity(
			"User",
			() => ({ name }),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.EntityStructure<
				"User",
				{ readonly name: string & DModeling.NewType<"UserName"> }
			>,
			"strict"
		>;

		expect(structure.name).toBe("User");
		expect(structure.map({ name: "Jane" })).toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane" } as never)),
		);
	});

	it("accepts nested entities in an entity shape", () => {
		const street = DModeling.createNewType("AddressStreet", DDataStructure.string());
		const address = DModeling.createEntity("Address", () => ({ street }));
		const structure = DModeling.createEntity("User", () => ({ address }));

		expect(structure.name).toBe("User");
	});

	it("rejects properties that are not new types or entities", () => {
		DModeling.createEntity(
			"User",
			// @ts-expect-error entity properties must be NewTypes or nested Entities.
			() => ({ name: DDataStructure.string() }),
		);
	});
});
