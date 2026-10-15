import type * as DInvocation from "@duplojs/lang/invocation";
import { type BookRepository } from "../repositories";
import { CreateBookFact } from "../entities";

export function createBook(
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
	return CreateBookFact.run({
		id: params.id,
		title: params.title,
	});
}
