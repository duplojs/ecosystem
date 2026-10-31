import type * as DInvocation from "@duplojs/lang/invocation";
import { type List, type Task } from "../entities";
import type * as DEither from "@duplojs/lang/either";

export interface ListRepository {
	findLinkedList<
		GenericTask extends Task.Entity & Task.LinkedWithListFlag,
	>(
		task: GenericTask
	): Promise<
		| DInvocation.EvidenceResult<"task-with-linked-list", {
			task: GenericTask;
			list: List.Entity;
		}>
		| DEither.Left<"linked-list-not-found", GenericTask>
	>;
}
