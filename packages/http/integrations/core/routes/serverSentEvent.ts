import { useRouteBuilder } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("GET", "/sse")
	.extract({
		query: {
			close: DDataStructure.optional(DDataStructure.boolean()),
		},
	})
	.handler(
		({ close }, { response }) => {
			if (close) {
				return response.noContent("close");
			}
			return response.serverSentEvents("super-sse").onStart<{ test: string }, { other: string }>(
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
