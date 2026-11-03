import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";
import { type User } from "../../user";

export const CreateListFact = DModeling.createFact<
	"ListCreated",
	{
		id: List.Id;
		title: List.Title;
		state: List.OpenState;
		creatorId: User.Id;
	},
	typeof List.Entity
>("ListCreated")(
	({ applyFact }) => (
		params: {
			id: List.Id;
			title: List.Title;
			creator: User.Entity;
		},
	) => {
		const state = List.OpenState.new({});
		const payload = {
			id: params.id,
			title: params.title,
			creatorId: params.creator.Id,
			state,
		};

		return DCommon.pipe(
			payload,
			List.Entity.new,
			List.OpenFlag.append(state),
			applyFact(payload),
		);
	},
);
export type CreateListFact = DModeling.GetFact<typeof CreateListFact>;
