import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";

export const CompleteListFact = DModeling.createFact<
	"ListCompleted",
	{
		state: List.CompletedState;
	},
	typeof List.Entity
>("ListCompleted")(
	({ applyFact }) => (list: List.Entity & List.OpenFlag) => {
		const state = List.CompletedState.new({});
		const payload = { state };

		return DCommon.pipe(
			list,
			List.Entity.update(payload),
			List.CompletedFlag.append(state),
			applyFact(payload),
		);
	},
);
export type CompleteListFact = DModeling.GetFact<typeof CompleteListFact>;
