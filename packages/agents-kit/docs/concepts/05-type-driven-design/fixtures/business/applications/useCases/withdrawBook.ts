import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import { type Book, withdrawBook } from "../../domains";
import { BookRepositoryPort, WaitingListEntryRepositoryPort } from "../ports";

export const WithdrawBookUseCase = DInvocation.createReader(
	{
		BookRepositoryPort,
		WaitingListEntryRepositoryPort,
	},
	({
		bookRepository,
		waitingListEntryRepository,
	}) => (
		params: {
			book: Book.Entity & (Book.AvailableFlag | Book.ReservedFlag);
		},
	) => DEither.rightAsyncPipe(
		params.book,
		(book) => DInvocation.consumeWorkflow(
			withdrawBook(book),
			{
				"commit/withdrawn-book": bookRepository.save,
				"iterate/active-waiting-list-entries-for-withdrawn-book": {
					getIterator: waitingListEntryRepository.findAllActiveByBook,
					concurrency: 5,
				},
				"commit/cancelled-waiting-list-entry": waitingListEntryRepository.save,
			},
		),
	),
);
