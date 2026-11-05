import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { Task } from "..";

export const CompleteTaskFact = DModeling.createFact<
	"TaskCompleted",
	{
		state: Task.CompletedState;
	},
	typeof Task.Entity
>("TaskCompleted")(
	({ applyFact }) => (task: Task.Entity & Task.PendingAndAssignedFlag) => {
		const state = Task.CompletedState.new({});
		const payload = { state };

		return DCommon.pipe(
			task,
			Task.Entity.update({ state }),
			Task.CompletedFlag.append(state),
			applyFact(payload),
		);
	},
);
export type CompleteTaskFact = DModeling.GetFact<typeof CompleteTaskFact>;
