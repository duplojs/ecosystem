import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { Task } from "..";
import { type User } from "../../user";

export type AssignTaskFact = DModeling.Fact<
	"TaskAssigned",
	{
		state: Task.PendingAndAssignedState;
	}
>;

export const AssignTaskFact = DModeling.createFact<
	AssignTaskFact,
	typeof Task.Entity
>("TaskAssigned")(
	({ applyFact }) => (
		params: {
			task: Task.Entity & (Task.PendingFlag | Task.PendingAndAssignedFlag);
			user: User.Entity;
		},
	) => {
		const state = Task.PendingAndAssignedState.new({
			assigneeUserId: params.user.Id,
		});
		const payload: DModeling.GetFactPayload<AssignTaskFact> = { state };

		return DCommon.pipe(
			params.task,
			Task.Entity.update(payload),
			Task.PendingAndAssignedFlag.append(state),
			applyFact(payload),
		);
	},
);
