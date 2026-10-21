import * as DModeling from "@duplojs/lang/modeling";
import { Book } from "..";
import * as DCommon from "@duplojs/lang/common";

export type CreateBookFact = DModeling.Fact<
	"CreateBook",
	{
		id: Book.Id;
		title: Book.Title;
		state: Book.AvailableState;
	}
>;
export const CreateBookFact = DModeling.createFact<
	CreateBookFact,
	typeof Book.Entity
>("CreateBook")(
	({ applyFact }) => (
		params: {
			id: Book.Id;
			title: Book.Title;
		},
	) => {
		const payload = {
			id: params.id,
			title: params.title,
			state: Book.AvailableState.new({}),
		};

		return DCommon.pipe(
			Book.Entity.new(payload),
			Book.AvailableFlag.append(payload.state),
			applyFact(payload),
		);
	},
);
