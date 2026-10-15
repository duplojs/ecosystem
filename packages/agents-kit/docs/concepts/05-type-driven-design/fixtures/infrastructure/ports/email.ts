import * as DInvocation from "@duplojs/lang/invocation";
import { EmailRepositoryPort } from "../../business/applications/ports";

export const emailRepository = EmailRepositoryPort.createImplementation({
	sendRentInformationalEmail: DInvocation.signedFunction(
		"sendRentInformationalEmail",
		async({ client, book }) => {
		},
	),
});
