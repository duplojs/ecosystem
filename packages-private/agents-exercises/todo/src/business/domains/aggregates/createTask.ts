import { CreateTaskFact } from "../entities/task/facts";
import type { List } from "../entities/list";
import type { Task } from "../entities/task";
import type { User } from "../entities/user";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export const createTask = DInvocation.createWorkflow(
	({ commit }) => function *(
		params: {
			list: (List.Entity & List.OpenFlag) | null;
			id: Task.Id;
			title: Task.Title;
			creator: User.Entity;
		},
	) {
		const createdTask = DCommon.pipe(
			{
				id: params.id,
				list: params.list,
				title: params.title,
				creator: params.creator,
			},
			CreateTaskFact.run,
			DEither.unwrapRight,
		);

		yield *commit("task", createdTask);

		return createdTask;
	},
);
