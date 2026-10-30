import type * as DInvocation from "@duplojs/lang/invocation";
import { type List } from "../entities/list";

export interface TaskRepository {
	checkAllTaskOfListAreCompleted(
		list: List.Entity & List.OpenFlag
	): Promise<
		& boolean
		& DInvocation.Evidence<"all-task-of-list-are-completed">
	>;
}
