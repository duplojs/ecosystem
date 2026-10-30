import * as DInvocation from "@duplojs/lang/invocation";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { CompleteTaskFact } from "../entities/task";
import { type refineLinkedTaskState } from "./refineLinkedTaskState";
import { type TaskRepository } from "../repositories";
import { CompleteListFact } from "../entities/list";

export function completeLinkedTask(
	likedTask: DInvocation.GetEvidenceResult<
		typeof refineLinkedTaskState,
		"pending-task-with-opened-linked-list"
	>,
) {
	const completedTask = DCommon.pipe(
		likedTask.task,
		CompleteTaskFact.run,
		DEither.unwrapRight,
	);

	return DInvocation.createStep(
		{
			completedTask,
			list: likedTask.list,
		},
		(
			allTaskAreCompleted: DInvocation.GetEvidenceResult<
				TaskRepository["checkAllTaskOfListAreCompleted"],
				"all-task-of-list-are-completed"
			>,
		) => {
			if (allTaskAreCompleted) {
				return DCommon.pipe(
					likedTask.list,
					CompleteListFact.run,
					(list) => DEither.result(
						"completed-task-and-list",
						{
							completedTask,
							list,
						},
					),
				);
			}

			return DEither.result(
				"completed-task",
				{
					completedTask,
					list: likedTask.list,
				},
			);
		},
	);
}
