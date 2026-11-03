import * as DInvocation from "@duplojs/lang/invocation";
import { AssignListFact, type User, type List, AssignTaskFact, Task } from "../entities";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { type TaskRepository } from "../repositories";

export const assignList = DInvocation.createWorkflow(
	({ commit, iterate }) => function *(
		params: {
			list: List.Entity & List.OpenFlag;
			user: User.Entity;
		},
	) {
		const assignedList = DCommon.pipe(
			params,
			AssignListFact.run,
			DEither.unwrapRight,
		);

		yield *commit("list", assignedList);

		yield *iterate("linked-task", params.list)(function *(
			task: DInvocation.GetEvidenceResult<
				TaskRepository["findAllLinkedTask"],
				"linked-task"
			>,
		) {
			const refinedTask = DCommon.pipe(
				task,
				Task.refineState,
				DEither.keepAsRightByInformation(["Pending", "PendingAndAssigned"]),
				DEither.unwrapRight,
			);

			if (DEither.isLeft(refinedTask)) {
				return;
			}

			const assignedTask = DCommon.pipe(
				{
					task: refinedTask,
					user: params.user,
				},
				AssignTaskFact.run,
				DEither.unwrapRight,
			);

			yield *commit("task", assignedTask);
		});
	},
);
