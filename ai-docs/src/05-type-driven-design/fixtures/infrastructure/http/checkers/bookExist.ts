import { createPresetChecker, ResponseContract, useCheckerBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import { type Book } from "../../../business/domains";
import { bookRepository } from "../../ports";

export const bookExist = useCheckerBuilder()
	.handler(async(id: Book.Id, { output }) => {
		const result = await bookRepository.findById(id);

		return DEither.matchInformation(result, {
			some: (book) => output("book.find", book),
			none: () => output("book.notfound", null),
		});
	});

export const iWantBookExist = createPresetChecker(bookExist, {
	result: "book.find",
	otherwise: ResponseContract.notFound("book.notfound"),
});
