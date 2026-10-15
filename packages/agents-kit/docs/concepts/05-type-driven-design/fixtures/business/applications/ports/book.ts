import * as DInvocation from "@duplojs/lang/invocation";
import { type Book, type BookRepository } from "../../domains";

export interface BookRepositoryPort extends BookRepository {
	save<
		GenericEntity extends Book.Entity & Book.Facts,
	>(entity: GenericEntity): Promise<GenericEntity>;
}

export const BookRepositoryPort = DInvocation.createPort<BookRepositoryPort>();
