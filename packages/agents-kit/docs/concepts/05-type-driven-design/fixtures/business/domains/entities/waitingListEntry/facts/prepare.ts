import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import { WaitingListEntry } from "..";

export const PrepareWaitingListEntryFact = DModeling.createFact<
	"PrepareWaitingListEntry",
	WaitingListEntry.ReadyState,
	typeof WaitingListEntry.Entity
>("PrepareWaitingListEntry")(
	({ applyFact }) => (
		waitingListEntry: WaitingListEntry.Entity & WaitingListEntry.PendingFlag,
	) => {
		const state = WaitingListEntry.ReadyState.new({});

		return DCommon.pipe(
			waitingListEntry,
			WaitingListEntry.Entity.update({ state }),
			WaitingListEntry.ReadyFlag.append(state),
			applyFact(state),
		);
	},
);
export type PrepareWaitingListEntryFact = DModeling.GetFact<typeof PrepareWaitingListEntryFact>;
