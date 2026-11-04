import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { Book, type Client } from "../entities";
import * as DInvocation from "@duplojs/lang/invocation";

export function refineLinkBetweenClientAndBorrowedBook(
	client: Client.Entity,
	book: Book.Entity & Book.BorrowedFlag,
) {
	if (
		DArray.includes(client.borrowedBooks, book.id)
		&& client.id === Book.BorrowedFlag.getPayload(book).currentBorrowerId
	) {
		return DCommon.pipe(
			{
				client,
				book,
			},
			DInvocation.evidenceResult(
				"client-with-borrowed-book",
			),
		);
	}

	return DCommon.pipe(
		{
			client,
			book,
		},
		DInvocation.evidenceResult(
			"client-and-book-without-link",
		),
	);
}
