import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";
import { type User } from "../../user";

export type AssignListFact = DModeling.Fact<
	"ListAssigned",
	{
		state: List.OpenAndAssignedState;
	}
>;

export const AssignListFact = DModeling.createFact<
	AssignListFact,
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
		const payload: DModeling.GetFactPayload<AssignListFact> = { state };

		return DCommon.pipe(
			params.list,
			List.Entity.update(payload),
			List.OpenAndAssignedFlag.append(state),
			applyFact(payload),
		);
	},
);
