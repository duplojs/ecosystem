import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import { BookRepositoryPort } from "../../business/applications/ports";

export const bookRepository = BookRepositoryPort.createImplementation({
	findById: (id) => Promise.resolve(DEither.none()),
	save: (entity) => Promise.resolve(entity),
	rankAvailability: DInvocation.signedFunction(
		"rankAvailability",
		async({ book }) => {

		},
	),
});
