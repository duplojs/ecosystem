import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("GET", "/sse")
	.extract({
		query: {
			close: DDataStructure.optional(DDataStructure.boolean()),
		},
	})
	.handler(
		[
			ResponseContract.serverSentEvents("super-sse", DDataStructure.object({ test: DDataStructure.string() }), { other: DDataStructure.string() }),
			ResponseContract.noContent("close"),
		],
		({ close }, { serverSentEventsResponse, response }) => {
			if (close) {
				return response("close");
			}
			return serverSentEventsResponse(
				"super-sse",
				async({ send }) => {
					await send("message", { test: "1" }, { retry: 100 });

					await DCommon.timeout(200);

					await send("message", { test: "2" }, { id: "test" });

					await DCommon.timeout(200);

					await send("other", "3");
				},
			);
		},
	);
