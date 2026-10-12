import type * as DInvocation from "@duplojs/lang/invocation";
import { type Book } from "../entities";
import type * as DEither from "@duplojs/lang/either";

export interface BookRepository {
	generateId(): Book.Id & DInvocation.Evidence<"generated">;
	titleIsAlreadyRegistered(title: Book.Title): Promise<
		| DInvocation.EvidenceResult<"title-already-registered", Book.Title>
		| DInvocation.EvidenceResult<"title-not-registered", Book.Title>
	>;
	rankAvailability: DInvocation.SignedFunction<
		"rankAvailability",
		(params: { book: Book.Entity }) => Promise<void>
	>;
	findById(id: Book.Id): Promise<DEither.Maybe<Book.Entity>>;
}
