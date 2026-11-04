import * as DModeling from "@duplojs/lang/modeling";
import { type Client } from "../../client";
import { Book } from "..";
import * as DCommon from "@duplojs/lang/common";

export const ReturnBookFact = DModeling.createFact<
	"ReturnBook",
	Client.Id,
	typeof Book.Entity
>("ReturnBook")(
	({ applyFact }) => (
		{
			client,
			book,
		}: {
			client: Client.Entity;
			book: Book.Entity & Book.BorrowedFlag;
		},
	) => {
		const availableState = Book.AvailableState.new({});

		return DCommon.pipe(
			book,
			Book.Entity.update({
				state: availableState,
			}),
			Book.AvailableFlag.append(availableState),
			applyFact(client.id),
		);
	},
);
export type ReturnBookFact = DModeling.GetFact<typeof ReturnBookFact>;
