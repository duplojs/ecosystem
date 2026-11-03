import * as DModeling from "@duplojs/lang/modeling";
import { type Client } from "../../client";
import { Book } from "..";
import * as DCommon from "@duplojs/lang/common";

export const BookRentalFact = DModeling.createFact<
	"BookRental",
	Book.BorrowedState,
	typeof Book.Entity
>("BookRental")(
	({ applyFact }) => (
		client: Client.Entity & Client.CanRentBookFlag,
		book: Book.Entity & Book.AvailableFlag,
	) => {
		const borrowedState = Book.BorrowedState.new({
			currentBorrowerId: client.id,
		});

		return DCommon.pipe(
			book,
			Book.Entity.update({
				state: borrowedState,
			}),
			Book.BorrowedFlag.append(borrowedState),
			applyFact(borrowedState),
		);
	},
);
export type BookRentalFact = DModeling.GetFact<typeof BookRentalFact>;
