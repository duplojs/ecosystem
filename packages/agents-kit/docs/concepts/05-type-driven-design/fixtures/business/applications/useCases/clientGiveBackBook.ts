import * as DInvocation from "@duplojs/lang/invocation";
import { clientGiveBackBook, type refineLinkBetweenClientAndBorrowedBook } from "../../domains";
import { BookRepositoryPort, ClientRepositoryPort, WaitingListEntryRepositoryPort } from "../ports";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export const ClientGiveBackBookUseCase = DInvocation.createReader(
	{
		BookRepositoryPort,
		ClientRepositoryPort,
		WaitingListEntryRepositoryPort,
	},
	({
		bookRepository,
		clientRepository,
		waitingListEntryRepository,
	}) => (
		params: DInvocation.GetEvidenceResult<
			typeof refineLinkBetweenClientAndBorrowedBook,
			"client-with-borrowed-book"
		>,
	) => DInvocation.consumeWorkflow(
		clientGiveBackBook(params),
		{
			"resolve/next-pending-waiting-list-entry": (book) => DCommon.asyncPipe(
				waitingListEntryRepository.findNextPendingForBook(book),
				DEither.keepAsRightByInformation(["next-pending-waiting-list-entry", "no-pending-waiting-list-entry"]),
			),
			"commit/book-and-client": ({ clientGivenBackBook, givenBackBook }) => DCommon.promiseObject({
				client: clientRepository.save(clientGivenBackBook),
				book: bookRepository.save(givenBackBook),
			}),
			"commit/book-client-and-waiting-list-entry": ({
				reservedBook,
				clientGivenBackBook,
				readyWaitingListEntry,
			}) => DCommon.promiseObject({
				book: bookRepository.save(reservedBook),
				client: clientRepository.save(clientGivenBackBook),
				waitingListEntry: waitingListEntryRepository.save(readyWaitingListEntry),
			}),
			"commit/rank-availability": bookRepository.rankAvailability,
		},
	),
);
