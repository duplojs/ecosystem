import * as DInvocation from "@duplojs/lang/invocation";
import { type BookRepository } from "../repositories";
import { CreateBookFact } from "../entities";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export const createBook = DInvocation.createWorkflow(
	({ commit }) => function *(
		params: {
			id: DInvocation.GetEvidenceResult<
				BookRepository["generateId"],
				"generated"
			>;
			title: DInvocation.GetEvidenceResult<
				BookRepository["titleIsAlreadyRegistered"],
				"title-not-registered"
			>;
		},
	) {
		const createdBook = DCommon.pipe(
			{
				id: params.id,
				title: params.title,
			},
			CreateBookFact.run,
			DEither.unwrapRight,
		);

		yield *commit("book", createdBook);

		return createdBook;
	},
);
