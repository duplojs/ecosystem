import * as DInvocation from "@duplojs/lang/invocation";
import { ClientGiveBackBook, ReturnBookFact, ReserveBookFact, PrepareWaitingListEntryFact } from "../entities";
import * as DEither from "@duplojs/lang/either";
import { type BookRepository, type WaitingListEntryRepository } from "../repositories";
import * as DCommon from "@duplojs/lang/common";
import { type refineLinkBetweenClientAndBorrowedBook } from "../refinements";

export const clientGiveBackBook = DInvocation.createWorkflow(
	({ commit, resolve }) => function *(
		clientWithBorrowedBook: DInvocation.GetEvidenceResult<
			typeof refineLinkBetweenClientAndBorrowedBook,
			"client-with-borrowed-book"
		>,
	) {
		const givenBackBook = DCommon.pipe(
			clientWithBorrowedBook,
			ReturnBookFact.run,
			DEither.unwrapRight,
		);

		const clientGivenBackBook = DCommon.pipe(
			clientWithBorrowedBook,
			ClientGiveBackBook.run,
			DEither.unwrapRight,
		);

		const selection: DInvocation.GetEvidenceResult<
			WaitingListEntryRepository["findNextPendingForBook"],
			"next-pending-waiting-list-entry" | "no-pending-waiting-list-entry"
		> = yield *resolve("next-pending-waiting-list-entry", givenBackBook);

		if (selection.waitingListEntry === null) {
			yield *commit("book-and-client", {
				givenBackBook,
				clientGivenBackBook,
			});

			yield *commit("rank-availability", givenBackBook)
				.withSignature<BookRepository["rankAvailability"]>();

			return DEither.result("book-returned-without-waiting-list-entry", {
				book: givenBackBook,
				client: clientGivenBackBook,
			});
		}

		const reservedBook = DCommon.pipe(
			selection,
			ReserveBookFact.run,
			DEither.unwrapRight,
		);

		const readyWaitingListEntry = DCommon.pipe(
			selection.waitingListEntry,
			PrepareWaitingListEntryFact.run,
			DEither.unwrapRight,
		);

		yield *commit("book-client-and-waiting-list-entry", {
			reservedBook,
			clientGivenBackBook,
			readyWaitingListEntry,
		});

		yield *commit("rank-availability", reservedBook)
			.withSignature<BookRepository["rankAvailability"]>();

		return DEither.result("book-returned-and-reserved", {
			book: reservedBook,
			client: clientGivenBackBook,
			waitingListEntry: readyWaitingListEntry,
		});
	},
);
