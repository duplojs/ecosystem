import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import * as DModeling from "@scripts/modeling";
import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

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

		type _CheckStructure = DCommon.ExpectType<
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

	it("accepts nullable, optional, tagged and nested entity values", () => {
		interface Shape {
			readonly values: readonly (string & DModeling.NewType<"Name">)[];
			readonly optional: undefined | (string & DModeling.NewType<"Name">);
			readonly nullable: null | (string & DModeling.NewType<"Name">);
			readonly tagged: DModeling.ObjectTag<"Tag"> & { readonly raw: string };
			readonly entity: DModeling.Entity<"Nested"> & { readonly raw: string };
		}

		type _CheckShape = DCommon.ExpectType<DModeling.ForbiddenMissingNewTypeInEntityShape<Shape>, never, "strict">;
	});

	it("identifies primitive array elements using the complete nested path", () => {
		interface Shape { readonly nested: { readonly values: readonly string[] } }

		type _CheckError = DCommon.ExpectType<
			DModeling.ForbiddenMissingNewTypeInEntityShape<Shape>,
			DCommon.ComputedTypeError<"Value at 'nested.values.[number]' is not a NewType.">,
			"strict"
		>;

		DModeling.createEntity(
			"User",
			// @ts-expect-error primitive array elements must be wrapped in a NewType.
			() => ({ values: DDataStructure.array(DDataStructure.string()) }),
		);
	});

	it("rejects primitive values nested inside records", () => {
		DModeling.createEntity(
			"User",
			// @ts-expect-error nested primitive record values must be wrapped in a NewType.
			() => ({ values: DDataStructure.record(DDataStructure.string(), DDataStructure.string()) }),
		);
	});

	it("does not report optional NewType properties as missing NewTypes", () => {
		interface Shape {
			readonly name?: string & DModeling.NewType<"Name">;
		}

		// The optional property is valid, so the diagnostic type should be never.
		type _CheckOptional = DCommon.ExpectType<DModeling.ForbiddenMissingNewTypeInEntityShape<Shape>, never, "strict">;
	});
});
