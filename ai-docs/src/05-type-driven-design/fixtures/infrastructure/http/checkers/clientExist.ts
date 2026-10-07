import { createPresetChecker, ResponseContract, useCheckerBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import { type Client } from "../../../business/domains";
import { clientRepository } from "../../ports";

export const clientExist = useCheckerBuilder()
	.handler(async(id: Client.Id, { output }) => {
		const result = await clientRepository.findById(id);

		return DEither.matchInformation(result, {
			some: (client) => output("client.find", client),
			none: () => output("client.notfound", null),
		});
	});

export const iWantClientExist = createPresetChecker(clientExist, {
	result: "client.find",
	otherwise: ResponseContract.notFound("client.notfound"),
});
