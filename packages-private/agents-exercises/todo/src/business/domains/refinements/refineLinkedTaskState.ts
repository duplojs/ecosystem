import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DInvocation from "@duplojs/lang/invocation";
import { type ListRepository } from "../repositories";
import { Task } from "../entities/task";
import { List } from "../entities/list";

export function refineLinkedTaskState(
	likedTask: DInvocation.GetEvidenceResult<
		ListRepository["findLinkedList"],
		"task-with-linked-list"
	>,
) {
	return DCommon.pipe(
		[
			Task.refineState(likedTask.task),
			List.refineState(likedTask.list),
		],
		DEither.matchInformationCombinationOtherwise(
			{
				"PendingAndAssigned/Open": ([task, list]) => DInvocation.evidenceResult(
					"pending-and-Assigned-task-with-opened-linked-list",
					{
						task,
						list,
					},
				),
			},
			([task, list]) => DCommon.pipe(
				DEither.group({
					task,
					list,
				}),
				DInvocation.evidenceResult("task-with-linked-list"),
			),
		),
	);
}
