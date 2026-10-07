import type * as DInvocation from "@duplojs/lang/invocation";
import { type Book } from "../entities";

export interface BookRepository {
	rankAvailability: DInvocation.SignedFunction<
		"rankAvailability",
		(params: { book: Book.Entity }) => Promise<void>
	>;
}
