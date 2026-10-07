import type * as DInvocation from "@duplojs/lang/invocation";
import { type Client, type Book } from "../entities";

export interface EmailRepository {
	sendRentInformationalEmail: DInvocation.SignedFunction<
		"sendRentInformationalEmail",
		(params: {
			client: Client.Entity;
			book: Book.Entity;
		}) => Promise<void>
	>;
}
