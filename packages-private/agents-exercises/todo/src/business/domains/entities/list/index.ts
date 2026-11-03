import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";
import type { AssignListFact, CompleteListFact, CreateListFact } from "./facts";
import { User } from "../user";

export * from "./facts";

export namespace List {
	const namespace = DModeling.createEntityNamespace("List");

	export const Id = namespace.createNewType(
		"Id",
		DDataStructure.string(),
		[DDataStructure.uuid()],
	);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Title = namespace.createNewType(
		"Title",
		DDataStructure.string(),
		[
			DDataStructure.trimmed(),
			DDataStructure.minCharacters(1),
			DDataStructure.maxCharacters(150),
		],
	);
	export type Title = DDataStructure.StructureValue<typeof Title>;

	export const OpenState = DModeling.createTaggedObject(
		"OpenState",
		{},
	);
	export type OpenState = DDataStructure.StructureValue<typeof OpenState>;

	export const OpenAndAssignedState = DModeling.createTaggedObject(
		"OpenAndAssignedState",
		{
			assigneeUserId: User.Id,
		},
	);
	export type OpenAndAssignedState = DDataStructure.StructureValue<typeof OpenAndAssignedState>;

	export const CompletedState = DModeling.createTaggedObject(
		"CompletedState",
		{},
	);
	export type CompletedState = DDataStructure.StructureValue<typeof CompletedState>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		title: Title,
		creatorId: User.Id,
		state: DDataStructure.union([
			OpenState,
			OpenAndAssignedState,
			CompletedState,
		]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = CreateListFact | CompleteListFact | AssignListFact;

	export type OpenFlag = DModeling.Flag<"Open", OpenState>;
	export const OpenFlag = DModeling.createFlag<OpenFlag, typeof Entity>("Open");

	export type OpenAndAssignedFlag = DModeling.Flag<"OpenAndAssigned", OpenAndAssignedState>;
	export const OpenAndAssignedFlag = DModeling.createFlag<OpenAndAssignedFlag, typeof Entity>("OpenAndAssigned");

	export type CompletedFlag = DModeling.Flag<"Completed", CompletedState>;
	export const CompletedFlag = DModeling.createFlag<CompletedFlag, typeof Entity>("Completed");

	export function refineState<GenericEntity extends Entity>(entity: GenericEntity) {
		return DPattern.matchWithTaggedObject(
			entity.state,
			{
				OpenState: (state) => DEither.result(
					"Open",
					OpenFlag.append(entity, state),
				),
				OpenAndAssignedState: (state) => DEither.result(
					"OpenAndAssigned",
					OpenAndAssignedFlag.append(entity, state),
				),
				CompletedState: (state) => DEither.result(
					"Completed",
					CompletedFlag.append(entity, state),
				),
			},
		);
	}
}
