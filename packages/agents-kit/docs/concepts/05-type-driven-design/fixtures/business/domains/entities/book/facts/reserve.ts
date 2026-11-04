import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import { Book } from "..";
import { type Client } from "../../client";
import { type WaitingListEntry } from "../../waitingListEntry";

export const ReserveBookFact = DModeling.createFact<
	"ReserveBook",
	{
		waitingListEntryId: WaitingListEntry.Id;
		clientId: Client.Id;
	},
	typeof Book.Entity
>("ReserveBook")(
	({ applyFact }) => (
		params: {
			book: Book.Entity & Book.AvailableFlag;
			waitingListEntry: WaitingListEntry.Entity & WaitingListEntry.PendingFlag;
		},
	) => {
		const payload = {
			waitingListEntryId: params.waitingListEntry.id,
			clientId: params.waitingListEntry.clientId,
		};
		const state = Book.ReservedState.new({
			waitingListEntryId: payload.waitingListEntryId,
		});

		return DCommon.pipe(
			params.book,
			Book.Entity.update({ state }),
			Book.ReservedFlag.append(state),
			applyFact(payload),
		);
	},
);
export type ReserveBookFact = DModeling.GetFact<typeof ReserveBookFact>;
