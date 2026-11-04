import * as DInvocation from "@duplojs/lang/invocation";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { type Book, WithdrawBookFact, CancelWaitingListEntryFact } from "../entities";
import { type WaitingListEntryRepository } from "../repositories";

export const withdrawBook = DInvocation.createWorkflow(
	({ commit, iterate }) => function *(book: Book.Entity & (Book.AvailableFlag | Book.ReservedFlag)) {
		const withdrawnBook = DCommon.pipe(
			book,
			WithdrawBookFact.run,
			DEither.unwrapRight,
		);

		yield *commit("withdrawn-book", withdrawnBook);

		yield *iterate("active-waiting-list-entries-for-withdrawn-book", withdrawnBook)(function *(
			linkedWaitingListEntry: DInvocation.GetEvidenceResult<
				WaitingListEntryRepository["findAllActiveByBook"],
				"active-waiting-list-entry-for-withdrawn-book"
			>,
		) {
			const cancelledWaitingListEntry = DCommon.pipe(
				{
					waitingListEntry: linkedWaitingListEntry.waitingListEntry,
					reason: "book-withdrawn",
				},
				CancelWaitingListEntryFact.run,
				DEither.unwrapRight,
			);

			yield *commit("cancelled-waiting-list-entry", cancelledWaitingListEntry);
		});

		return withdrawnBook;
	},
);
