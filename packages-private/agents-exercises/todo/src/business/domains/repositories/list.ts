import type * as DInvocation from "@duplojs/lang/invocation";
import { type List, type Task } from "../entities";

export interface ListRepository {
	findLinkedList<
		GenericTask extends Task.Entity & Task.LinkedWithListFlag,
	>(
		task: GenericTask
	): Promise<
		DInvocation.EvidenceResult<"task-with-linked-list", {
			task: GenericTask;
			list: List.Entity;
		}>
	>;
}
