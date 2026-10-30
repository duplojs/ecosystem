import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { List } from "..";
import { type User } from "../../user";

export type CreateListFact = DModeling.Fact<
	"ListCreated",
	{
		id: List.Id;
		title: List.Title;
		state: List.OpenState;
		creatorId: User.Id;
	}
>;

export const CreateListFact = DModeling.createFact<
	CreateListFact,
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
		const payload: DModeling.GetFactPayload<CreateListFact> = {
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
