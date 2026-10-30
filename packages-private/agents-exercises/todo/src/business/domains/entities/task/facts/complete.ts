import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { Task } from "..";

export type CompleteTaskFact = DModeling.Fact<
	"TaskCompleted",
	{
		state: Task.CompletedState;
	}
>;

export const CompleteTaskFact = DModeling.createFact<
	CompleteTaskFact,
	typeof Task.Entity
>("TaskCompleted")(
	({ applyFact }) => (task: Task.Entity & Task.PendingFlag) => {
		const state = Task.CompletedState.new({});
		const payload: DModeling.GetFactPayload<CompleteTaskFact> = { state };

		return DCommon.pipe(
			task,
			Task.Entity.update({ state }),
			Task.CompletedFlag.append(state),
			applyFact(payload),
		);
	},
);
