import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";
import { List } from "../list";
import type { AssignTaskFact, CompleteTaskFact, CreateTaskFact } from "./facts";
import * as DCommon from "@duplojs/lang/common";
import { User } from "../user";

export * from "./facts";

export namespace Task {
	const namespace = DModeling.createEntityNamespace("Task");

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

	export const PendingState = DModeling.createTaggedObject(
		"PendingState",
		{},
	);
	export type PendingState = DDataStructure.StructureValue<typeof PendingState>;

	export const PendingAndAssignedState = DModeling.createTaggedObject(
		"PendingAndAssignedState",
		{
			assigneeUserId: User.Id,
		},
	);
	export type PendingAndAssignedState = DDataStructure.StructureValue<typeof PendingAndAssignedState>;

	export const CompletedState = DModeling.createTaggedObject(
		"CompletedState",
		{},
	);
	export type CompletedState = DDataStructure.StructureValue<typeof CompletedState>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		listId: DDataStructure.nullable(List.Id),
		title: Title,
		creatorId: User.Id,
		state: DDataStructure.union([
			PendingState,
			PendingAndAssignedState,
			CompletedState,
		]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = CreateTaskFact | CompleteTaskFact | AssignTaskFact;

	export const PendingFlag = DModeling.createFlag<"Pending", PendingState, typeof Entity>("Pending");
	export type PendingFlag = DModeling.GetFlag<typeof PendingFlag>;

	export const PendingAndAssignedFlag = DModeling.createFlag<"PendingAndAssigned", PendingAndAssignedState, typeof Entity>("PendingAndAssigned");
	export type PendingAndAssignedFlag = DModeling.GetFlag<typeof PendingAndAssignedFlag>;

	export const CompletedFlag = DModeling.createFlag<"Completed", CompletedState, typeof Entity>("Completed");
	export type CompletedFlag = DModeling.GetFlag<typeof CompletedFlag>;

	export function refineState<
		GenericEntity extends Entity,
	>(entity: GenericEntity) {
		return DPattern.matchWithTaggedObject(
			entity.state,
			{
				PendingState: (state) => DEither.result(
					"Pending",
					PendingFlag.append(entity, state),
				),
				PendingAndAssignedState: (state) => DEither.result(
					"PendingAndAssigned",
					PendingAndAssignedFlag.append(entity, state),
				),
				CompletedState: (state) => DEither.result(
					"Completed",
					CompletedFlag.append(entity, state),
				),
			},
		);
	}

	export const LinkedWithListFlag = DModeling.createFlag<"LinkedWithList", List.Id, typeof Entity>("LinkedWithList");
	export type LinkedWithListFlag = DModeling.GetFlag<typeof LinkedWithListFlag>;

	export const NotLinkedWithListFlag = DModeling.createFlag<"NotLinkedWithList", null, typeof Entity>("NotLinkedWithList");
	export type NotLinkedWithListFlag = DModeling.GetFlag<typeof NotLinkedWithListFlag>;

	export function refineLinkedListState<
		GenericEntity extends Entity,
	>(entity: GenericEntity) {
		if (entity.listId) {
			return DCommon.pipe(
				entity,
				LinkedWithListFlag.append(entity.listId),
				DEither.result("LinkedWithList"),
			);
		}

		return DCommon.pipe(
			entity,
			NotLinkedWithListFlag.append(null),
			DEither.result("NotLinkedWithList"),
		);
	}
}
