import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import { Book } from "..";

export const WithdrawBookFact = DModeling.createFact<
	"WithdrawBook",
	Book.WithdrawnState,
	typeof Book.Entity
>("WithdrawBook")(
	({ applyFact }) => (book: Book.Entity & (Book.AvailableFlag | Book.ReservedFlag)) => {
		const state = Book.WithdrawnState.new({});

		return DCommon.pipe(
			book,
			Book.Entity.update({ state }),
			Book.WithdrawnFlag.append(state),
			applyFact(state),
		);
	},
);
export type WithdrawBookFact = DModeling.GetFact<typeof WithdrawBookFact>;
