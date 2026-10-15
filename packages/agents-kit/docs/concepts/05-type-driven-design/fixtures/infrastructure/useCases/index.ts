import * as DInvocation from "@duplojs/lang/invocation";
import * as UseCases from "../../business/applications/useCases";
import { bookRepository, clientRepository, emailRepository } from "../ports";

export const useCases = DInvocation.resolveReaders(
	UseCases,
	{
		bookRepository,
		clientRepository,
		emailRepository,
	},
);
