import * as DInvocation from "@duplojs/lang/invocation";
import { BookRentalFact, ClientRentBookFact, type Book, type Client } from "../entities";
import * as DEither from "@duplojs/lang/either";
import { type EmailRepository } from "../repositories/email";
import * as DCommon from "@duplojs/lang/common";

export const clientRentBook = DInvocation.createWorkflow(
	({ commit }) => function *(
		params: {
			client: Client.Entity & Client.CanRentBookFlag;
			book: Book.Entity & Book.AvailableFlag;
		},
	) {
		const clientWithBorrowedBook = DCommon.pipe(
			params,
			ClientRentBookFact.run,
			DEither.unwrapRight,
		);

		const borrowedBook = DCommon.pipe(
			params,
			BookRentalFact.run,
			DEither.unwrapRight,
		);

		yield *commit("book-and-client", {
			borrowedBook,
			clientWithBorrowedBook,
		});

		yield *commit("send-informational-email", {
			book: borrowedBook,
			client: clientWithBorrowedBook,
		})
			.withSignature<EmailRepository["sendRentInformationalEmail"]>();

		return {
			book: borrowedBook,
			client: clientWithBorrowedBook,
		};
	},
);
