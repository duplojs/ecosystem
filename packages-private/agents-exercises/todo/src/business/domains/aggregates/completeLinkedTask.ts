import * as DInvocation from "@duplojs/lang/invocation";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { CompleteTaskFact } from "../entities/task";
import { type refineLinkedTaskState } from "../refinements";
import { type TaskRepository } from "../repositories";
import { CompleteListFact } from "../entities/list";

export const completeLinkedTask = DInvocation.createWorkflow(
	({ commit, resolve }) => function *(
		likedTask: DInvocation.GetEvidenceResult<
			typeof refineLinkedTaskState,
			"pending-and-Assigned-task-with-opened-linked-list"
		>,
	) {
		const completedTask = DCommon.pipe(
			likedTask.task,
			CompleteTaskFact.run,
			DEither.unwrapRight,
		);

		yield *commit("task", completedTask);

		const allTaskAreCompleted: DInvocation.GetEvidenceResult<
			TaskRepository["checkAllTaskOfListAreCompleted"],
			"all-task-of-list-are-completed"
		> = yield *resolve("allTaskAreCompleted", likedTask.list);

		if (allTaskAreCompleted) {
			const completedList = DCommon.pipe(
				likedTask.list,
				CompleteListFact.run,
				DEither.unwrapRight,
			);

			yield *commit("list", completedList);

			return DEither.result(
				"completed-task-and-list",
				{
					completedTask,
					completedList,
				},
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
