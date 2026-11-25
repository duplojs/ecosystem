import { useRouteBuilder } from "@duplojs/http";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DEither from "@duplojs/lang/either";
import * as DNumber from "@duplojs/lang/number";

export namespace EntityFixture {
	const namespace = DModeling.createEntityNamespace("EntityFixture");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Name = namespace.createNewType("Name", DDataStructure.string(), [
		DDataStructure.minCharacters(3),
		DDataStructure.maxCharacters(80),
	]);
	export type Name = DDataStructure.StructureValue<typeof Name>;

	export const Priority = namespace.createNewType("Priority", DDataStructure.number(), [
		DDataStructure.greaterThanOrEqual(1),
		DDataStructure.lessThanOrEqual(10),
	]);
	export type Priority = DDataStructure.StructureValue<typeof Priority>;

	export const CreatedAt = namespace.createNewType("CreatedAt", DDataStructure.date());
	export type CreatedAt = DDataStructure.StructureValue<typeof CreatedAt>;

	export const Duration = namespace.createNewType("Duration", DDataStructure.time());
	export type Duration = DDataStructure.StructureValue<typeof Duration>;

	export interface Node extends DModeling.ObjectTag<"EntityFixtureNode"> {
		readonly label: string;
		readonly children: readonly Node[];
	}

	export const Node: DModeling.TaggedObjectStructure<Node> = DModeling.createTaggedObject<Node>(
		"EntityFixtureNode",
	)(
		{
			label: DDataStructure.string(),
			children: DDataStructure.array(DDataStructure.lazy(() => Node)),
		},
	);

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		name: Name,
		priority: Priority,
		createdAt: CreatedAt,
		duration: Duration,
		tree: Node,
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export const HighPriorityFlag = DModeling.createFlag<"HighPriority", Priority, typeof Entity>("HighPriority");
	export type HighPriorityFlag = DModeling.GetFlag<typeof HighPriorityFlag>;
}

interface NodeInput {
	readonly label: string;
	readonly children: readonly NodeInput[];
}

const NodeInput: DDataStructure.Structure<NodeInput> = DDataStructure.object({
	label: DDataStructure.string(),
	children: DDataStructure.array(DDataStructure.lazy(() => NodeInput)),
}).contract();

useRouteBuilder("POST", "/entity-fixture/new")
	.extract({
		body: {
			id: EntityFixture.Id,
			name: EntityFixture.Name,
			priority: EntityFixture.Priority,
			createdAt: EntityFixture.CreatedAt,
			duration: EntityFixture.Duration,
			tree: EntityFixture.Node,
		},
	})
	.handler((floor, { response }) => {
		const entity = EntityFixture.Entity.new({
			id: floor.id,
			name: floor.name,
			priority: floor.priority,
			createdAt: floor.createdAt,
			duration: floor.duration,
			tree: floor.tree,
		});
		if (DNumber.greaterThanOrEqual(entity.priority, 6)) {
			return response.created(
				"entity-fixture.high-priority",
				EntityFixture.HighPriorityFlag.append(entity, entity.priority),
			);
		}
		return response.ok("entity-fixture.created", entity);
	});

useRouteBuilder("POST", "/entity-fixture/map")
	.extract({
		body: {
			id: DDataStructure.string(),
			name: DDataStructure.string(),
			priority: DDataStructure.number(),
			createdAt: DDataStructure.date(),
			duration: DDataStructure.time(),
			tree: NodeInput,
		},
	})
	.handler((floor, { response }) => {
		const hydrateNode = (input: NodeInput): EntityFixture.Node => EntityFixture.Node.new({
			label: input.label,
			children: DArray.map(input.children, hydrateNode),
		});
		const result = EntityFixture.Entity.map({
			id: floor.id,
			name: floor.name,
			priority: floor.priority,
			createdAt: floor.createdAt,
			duration: floor.duration,
			tree: hydrateNode(floor.tree),
		});
		if (DEither.isLeft(result)) {
			return response.unprocessableContent("entity-fixture.mapping-failed", {
				reason: DEither.hasInformation(result, "map-error") ? "map-error" : "async-error",
			});
		}

		const entity = DEither.unwrapRight(result);
		if (DNumber.greaterThanOrEqual(entity.priority, 6)) {
			return response.created(
				"entity-fixture.high-priority",
				EntityFixture.HighPriorityFlag.append(entity, entity.priority),
			);
		}
		return response.ok("entity-fixture.created", entity);
	});
