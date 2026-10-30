import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { Task } from "..";
import { type List } from "../../list";
import { type User } from "../../user";

export type CreateTaskFact = DModeling.Fact<
	"TaskCreated",
	{
		id: Task.Id;
		listId: List.Id | null;
		title: Task.Title;
		state: Task.PendingState;
		creatorId: User.Id;
	}
>;

export const CreateTaskFact = DModeling.createFact<
	CreateTaskFact,
	typeof Task.Entity
>("TaskCreated")(
	({ applyFact }) => (
		params: {
			id: Task.Id;
			list: List.Entity | null;
			title: Task.Title;
			creator: User.Entity;
		},
	) => {
		const state = Task.PendingState.new({});
		const payload: DModeling.GetFactPayload<CreateTaskFact> = {
			id: params.id,
			listId: params.list?.id ?? null,
			title: params.title,
			creatorId: params.creator.Id,
			state,
		};

		return DCommon.pipe(
			payload,
			Task.Entity.new,
			Task.PendingFlag.append(state),
			applyFact(payload),
		);
	},
);
