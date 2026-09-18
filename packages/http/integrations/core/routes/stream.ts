import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("GET", "/stream")
	.extract({
		query: {
			value: DDataStructure.number(),
		},
	})
	.handler(
		ResponseContract.stream("monSuperStream", DDataStructure.number()),
		({ value }, { streamResponse }) => streamResponse(
			"monSuperStream",
			async({ send }) => {
				await send(1);

				await DCommon.timeout(200);

				await send(2);

				await DCommon.timeout(200);

				await send(3);

				await DCommon.timeout(200);

				await send(4);

				await DCommon.timeout(200);

				await send(5);

				await DCommon.timeout(200);

				await send(value);
			},
		),
	);

useRouteBuilder("POST", "/stream-text")
	.extract({
		body: {
			value: DDataStructure.string(),
		},
	})
	.handler(
		ResponseContract.streamText("monSuperStream"),
		({ value }, { streamTextResponse }) => streamTextResponse(
			"monSuperStream",
			async({ send }) => {
				await send("super");

				await DCommon.timeout(200);

				await send("Value");

				await DCommon.timeout(200);

				await send("De");

				await DCommon.timeout(200);

				await send("La");

				await DCommon.timeout(200);

				await send("Mort");

				await DCommon.timeout(200);

				await send(` ${value}`);
			},
		),
	);
