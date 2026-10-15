import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import { BookRepositoryPort } from "../../business/applications/ports";
import * as DCommon from "@duplojs/lang/common";
import { Book } from "../../business";

export const bookRepository = BookRepositoryPort.createImplementation({
	findById: (id) => Promise.resolve(DEither.none()),
	generateId: () => DCommon.pipe(
		"SuperId",
		Book.Id.map,
		DEither.unwrapRightOrThrow,
		DInvocation.appendEvidence("generated"),
	),
	save: (entity) => Promise.resolve(entity),
	rankAvailability: DInvocation.signedFunction(
		"rankAvailability",
		async({ book }) => {

		},
	),
	titleIsAlreadyRegistered: (title) => Promise.resolve(
		DInvocation.evidenceResult("title-already-registered", title),
	),
});
