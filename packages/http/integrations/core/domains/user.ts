import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";

export namespace User {
	const namespace = DModeling.createEntityNamespace("User");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		friends: DDataStructure.array(
			Id,
			[DDataStructure.maxElements(5)],
		),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
}
