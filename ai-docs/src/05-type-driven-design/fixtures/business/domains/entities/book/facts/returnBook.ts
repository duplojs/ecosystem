import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "../../client";
import { Book } from "..";
import * as DCommon from "@duplojs/lang/common";

export type ReturnBookFact = DModeling.Fact<
	"ReturnBook",
	Client.Id
>;
export const ReturnBookFact = DModeling.createFact<
	ReturnBookFact,
	typeof Book.Entity
>("ReturnBook")(
	({ applyFact }) => (
		client: Client.Entity & Client.HaveBookFlag,
	) => {
		const book = Client.HaveBookFlag.getPayload(client);

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
