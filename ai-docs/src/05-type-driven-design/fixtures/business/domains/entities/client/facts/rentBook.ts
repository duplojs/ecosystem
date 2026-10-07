import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "..";
import { type Book } from "../../book";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export type ClientRentBookFact = DModeling.Fact<
	"ClientRentBookFact",
	Client.Entity["borrowedBooks"]
>;
export const ClientRentBookFact = DModeling.createFact<
	ClientRentBookFact,
	typeof Client.Entity
>("ClientRentBookFact")(
	({ applyFact }) => (
		client: Client.Entity & Client.CantRentBookFlag,
		book: Book.Entity & Book.AvailableFlag,
	) => {
		const borrowedBooks = DArray.push(
			Client.CantRentBookFlag.getPayload(client),
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
