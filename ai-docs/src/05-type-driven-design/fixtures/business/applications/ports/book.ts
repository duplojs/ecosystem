import * as DInvocation from "@duplojs/lang/invocation";
import type * as DEither from "@duplojs/lang/either";
import { type Book, type BookRepository } from "../../domains";

export interface BookRepositoryPort extends BookRepository {
	findById(id: Book.Id): Promise<DEither.Maybe<Book.Entity>>;

	save<
		GenericEntity extends Book.Entity & Book.Facts,
	>(entity: GenericEntity): Promise<GenericEntity>;
}

export const BookRepositoryPort = DInvocation.createPort<BookRepositoryPort>();
