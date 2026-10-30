import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";

export namespace User {
	const namespace = DModeling.createEntityNamespace("User");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Name = namespace.createNewType("Name", DDataStructure.string(), [
		DDataStructure.minCharacters(3),
		DDataStructure.maxCharacters(45),
	]);
	export type Name = DDataStructure.StructureValue<typeof Name>;

	export const Entity = namespace.createEntity(() => ({
		Id,
		Name,
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
}
