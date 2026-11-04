import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "..";
import { type Book } from "../../book";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export const ClientGiveBackBook = DModeling.createFact<
	"ClientGiveBackBook",
	Book.Entity,
	typeof Client.Entity
>("ClientGiveBackBook")(
	({ applyFact }) => (
		{
			client,
			book,
		}: {
			client: Client.Entity;
			book: Book.Entity & Book.BorrowedFlag;
		},
	) => {
		const borrowedBooks = DArray.filter(
			client.borrowedBooks,
			(bookId) => bookId !== book.id,
		);

		return DCommon.pipe(
			client,
			Client.Entity.update({
				borrowedBooks,
			}),
			applyFact(book),
		);
	},
);
export type ClientGiveBackBook = DModeling.GetFact<typeof ClientGiveBackBook>;
