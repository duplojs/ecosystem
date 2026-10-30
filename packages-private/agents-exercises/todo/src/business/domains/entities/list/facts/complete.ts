import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";

export type CompleteListFact = DModeling.Fact<
	"ListCompleted",
	{
		state: List.CompletedState;
	}
>;

export const CompleteListFact = DModeling.createFact<
	CompleteListFact,
	typeof List.Entity
>("ListCompleted")(
	({ applyFact }) => (list: List.Entity & List.OpenFlag) => {
		const state = List.CompletedState.new({});
		const payload: DModeling.GetFactPayload<CompleteListFact> = { state };

		return DCommon.pipe(
			list,
			List.Entity.update(payload),
			List.CompletedFlag.append(state),
			applyFact(payload),
		);
	},
);
