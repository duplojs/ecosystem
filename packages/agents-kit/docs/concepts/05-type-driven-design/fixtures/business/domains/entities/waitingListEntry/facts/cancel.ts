import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import { WaitingListEntry } from "..";

export const CancelWaitingListEntryFact = DModeling.createFact<
	"CancelWaitingListEntry",
	WaitingListEntry.CancelledState,
	typeof WaitingListEntry.Entity
>("CancelWaitingListEntry")(
	({ applyFact }) => (
		params: {
			waitingListEntry: WaitingListEntry.Entity & (WaitingListEntry.PendingFlag | WaitingListEntry.ReadyFlag);
			reason: WaitingListEntry.CancelledState["reason"];
		},
	) => {
		const state = WaitingListEntry.CancelledState.new({ reason: params.reason });

		return DCommon.pipe(
			params.waitingListEntry,
			WaitingListEntry.Entity.update({ state }),
			WaitingListEntry.CancelledFlag.append(state),
			applyFact(state),
		);
	},
);
export type CancelWaitingListEntryFact = DModeling.GetFact<typeof CancelWaitingListEntryFact>;
