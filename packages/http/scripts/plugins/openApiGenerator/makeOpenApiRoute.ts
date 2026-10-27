import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import type { RoutePath } from "@core/route";
import { IgnoreByOpenApiGeneratorMetadata } from "./metadata";

export function makeOpenApiRoute(
	routePath: RoutePath,
	openApiPage: string,
) {
	return useRouteBuilder(
		"GET",
		routePath,
		{
			metadata: [
				IgnoreByRouteStoreMetadata(),
				IgnoreByOpenApiGeneratorMetadata(),
			],
		},
	)
		.handler(
			(__, { response }) => response.ok("swaggerUi", openApiPage)
				.setHeader("content-type", "text/html"),
		);
}
