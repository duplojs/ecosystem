import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "..";
import { type Book } from "../../book";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export type ClientGiveBackBook = DModeling.Fact<
	"ClientGiveBackBook",
	Book.Entity
>;
export const ClientGiveBackBook = DModeling.createFact<
	ClientGiveBackBook,
	typeof Client.Entity
>("ClientGiveBackBook")(
	({ applyFact }) => (
		client: Client.Entity & Client.HaveBookFlag,
	) => {
		const book = Client.HaveBookFlag.getPayload(client);

		const borrowedBooks = DArray.filter(
			client.borrowedBooks,
			(bookId) => bookId === book.id,
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
