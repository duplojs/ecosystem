import * as DInvocation from "@duplojs/lang/invocation";
import { createBook, type Book } from "../../domains";
import * as DEither from "@duplojs/lang/either";
import { BookRepositoryPort } from "../ports";
import * as DCommon from "@duplojs/lang/common";

export const CreateBookUseCase = DInvocation.createReader(
	{
		BookRepositoryPort,
	},
	({
		bookRepository,
	}) => (
		params: {
			title: Book.Title;
		},
	) => DEither.rightAsyncPipe(
		DCommon.asyncPipe(
			bookRepository.titleIsAlreadyRegistered(params.title),
			DEither.keepAsRightByInformation(
				"title-not-registered",
			),
		),
		(title) => createBook({
			id: bookRepository.generateId(),
			title,
		}),
		(book) => DCommon.promiseObject({
			book: bookRepository.save(book),
		}),
	),
);
