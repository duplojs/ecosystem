import * as DCommon from "@duplojs/lang/common";
import { CreateListFact, type List } from "../entities/list";
import type { User } from "../entities/user";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";

export const createList = DInvocation.createWorkflow(
	({ commit }) => function *(
		params: {
			id: List.Id;
			title: List.Title;
			creator: User.Entity;
		},
	) {
		const createdList = DCommon.pipe(
			{
				id: params.id,
				title: params.title,
				creator: params.creator,
			},
			CreateListFact.run,
			DEither.unwrapRight,
		);

		yield *commit("list", createdList);

		return createdList;
	},
);

