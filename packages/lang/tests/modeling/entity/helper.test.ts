import { DDataStructure, DEither, DModeling, type DString, type ExpectType } from "@scripts";

describe("createEntity", () => {
	it("creates an entity composed of new types", () => {
		const name = DModeling.createNewType("UserName", DDataStructure.string());
		const tag = DModeling.createNewType(
			"UserTag",
			DDataStructure.string(),
			[
				DDataStructure.trimmed(),
				DDataStructure.minCharacters(2),
				DDataStructure.maxCharacters(20),
			],
		);
		const structure = DModeling.createEntity(
			"User",
			() => ({
				name,
				tags: DDataStructure.array(tag),
				recordTag: DDataStructure.record(
					DDataStructure.string(),
					tag,
				),
				objectTag: DDataStructure.object({
					test: tag,
				}),
			}),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.EntityStructure<
				"User",
				{
					readonly name: string & DModeling.NewType<"UserName">;
					readonly tags: readonly (
						string & DModeling.NewType<"UserTag", DString.Trimmed | DString.MinCharacters<2> | DString.MaxCharacters<20>>
					)[];
					readonly recordTag: Partial<{
						readonly [x: string]: string & DModeling.NewType<"UserTag", DString.Trimmed | DString.MinCharacters<2> | DString.MaxCharacters<20>>;
					}>;
					readonly objectTag: {
						readonly test: string & DModeling.NewType<"UserTag", DString.Trimmed | DString.MinCharacters<2> | DString.MaxCharacters<20>>;
					};
				}
			>,
			"strict"
		>;

		expect(structure.name).toBe("User");
		expect(structure.map({
			name: "Jane",
			tags: ["TEST"],
			recordTag: {},
			objectTag: {
				test: "TEST",
			},
		})).toStrictEqual(
			DEither.right("map-success", structure.new({
				name: "Jane",
				tags: ["TEST"],
				recordTag: {},
				objectTag: {
					test: "TEST",
				},
			} as never)),
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
