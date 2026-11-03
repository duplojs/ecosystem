import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "..";
import { type Book } from "../../book";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export const ClientRentBookFact = DModeling.createFact<
	"ClientRentBookFact",
	Client.Entity["borrowedBooks"],
	typeof Client.Entity
>("ClientRentBookFact")(
	({ applyFact }) => (
		client: Client.Entity & Client.CanRentBookFlag,
		book: Book.Entity & Book.AvailableFlag,
	) => {
		const borrowedBooks = DArray.push(
			Client.CanRentBookFlag.getPayload(client),
			book.id,
		);

		return DCommon.pipe(
			client,
			Client.Entity.update({
				borrowedBooks,
			}),
			applyFact(borrowedBooks),
		);
	},
);
export type ClientRentBookFact = DModeling.GetFact<typeof ClientRentBookFact>;
