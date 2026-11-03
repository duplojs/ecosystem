import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";
import { type User } from "../../user";

export const AssignListFact = DModeling.createFact<
	"ListAssigned",
	{
		state: List.OpenAndAssignedState;
	},
	typeof List.Entity
>("ListAssigned")(
	({ applyFact }) => (
		params: {
			list: List.Entity & List.OpenFlag;
			user: User.Entity;
		},
	) => {
		const state = List.OpenAndAssignedState.new({
			assigneeUserId: params.user.Id,
		});
		const payload = { state };

		return DCommon.pipe(
			params.list,
			List.Entity.update(payload),
			List.OpenAndAssignedFlag.append(state),
			applyFact(payload),
		);
	},
);
export type AssignListFact = DModeling.GetFact<typeof AssignListFact>;
