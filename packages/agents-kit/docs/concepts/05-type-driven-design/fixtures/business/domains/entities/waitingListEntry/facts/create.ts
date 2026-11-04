import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import { WaitingListEntry } from "..";
import { type Book } from "../../book";
import { type Client } from "../../client";

export const CreateWaitingListEntryFact = DModeling.createFact<
	"CreateWaitingListEntry",
	WaitingListEntry.PendingState,
	typeof WaitingListEntry.Entity
>("CreateWaitingListEntry")(
	({ applyFact }) => (params: {
		id: WaitingListEntry.Id;
		book: Book.Entity & (Book.AvailableFlag | Book.BorrowedFlag | Book.ReservedFlag);
		client: Client.Entity;
		requestedAt: WaitingListEntry.RequestedAt;
	}) => {
		const state = WaitingListEntry.PendingState.new({});

		return DCommon.pipe(
			WaitingListEntry.Entity.new({
				id: params.id,
				bookId: params.book.id,
				clientId: params.client.id,
				requestedAt: params.requestedAt,
				state,
			}),
			WaitingListEntry.PendingFlag.append(state),
			applyFact(state),
		);
	},
);
export type CreateWaitingListEntryFact = DModeling.GetFact<typeof CreateWaitingListEntryFact>;
