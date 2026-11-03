import type * as DInvocation from "@duplojs/lang/invocation";
import type * as DEither from "@duplojs/lang/either";
import { type Task } from "../entities/task";
import { type List } from "../entities/list";

export interface TaskRepository {
	findById(id: Task.Id): Promise<DEither.Maybe<Task.Entity>>;
	checkAllTaskOfListAreCompleted(
		list: List.Entity & List.OpenFlag
	): Promise<
		& boolean
		& DInvocation.Evidence<"all-task-of-list-are-completed">
	>;
	findAllLinkedTask(
		list: List.Entity
	): Promise<
		AsyncGenerator<
			& Task.Entity
			& Task.LinkedWithListFlag
			& DInvocation.Evidence<"linked-task">
		>
	>;
}
