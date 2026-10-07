import * as DInvocation from "@duplojs/lang/invocation";
import * as useCases from "../../business/applications/useCases";
import { bookRepository, clientRepository, emailRepository } from "../ports";

export const { clientGiveBackBookUseCase, clientRentBookUseCase } = DInvocation.resolveReaders(
	useCases,
	{
		bookRepository,
		clientRepository,
		emailRepository,
	},
);
