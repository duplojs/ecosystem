import { createHub } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import * as DServerCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as Routes from "./routes";

const envs = await DServerCommon.environmentVariableOrThrow({
	ENVIRONMENT: DDataStructure.literal(["DEV", "PROD"]),
	HOST: DDataStructure.literal(["localhost", "127.0.0.1", "0.0.0.0", "::1", "::"]),
	PORT: DDataStructure.number(),
});

export const hub = createHub({ environment: envs.ENVIRONMENT })
	.register(Routes);

await createHttpServer(hub, {
	host: envs.HOST,
	port: envs.PORT,
});
