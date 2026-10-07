import { ClientRepositoryPort } from "../../business/applications/ports";
import * as DEither from "@duplojs/lang/either";

export const clientRepository = ClientRepositoryPort.createImplementation({
	findById: (id) => Promise.resolve(DEither.none()),
	save: (entity) => Promise.resolve(entity),
});
