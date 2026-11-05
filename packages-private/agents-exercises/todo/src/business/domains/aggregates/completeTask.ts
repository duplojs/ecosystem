import * as DCommon from "@duplojs/lang/common";
import { CompleteTaskFact, type Task } from "../entities/task";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";

export const completeTask = DInvocation.createWorkflow(
	({ commit }) => function *(task: Task.Entity & Task.NotLinkedWithListFlag & Task.PendingAndAssignedFlag) {
		const completedTask = DCommon.pipe(
			task,
			CompleteTaskFact.run,
			DEither.unwrapRight,
		);

		yield *commit("task", completedTask);

		return completedTask;
	},
);
