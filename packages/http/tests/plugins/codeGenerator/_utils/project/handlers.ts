import { useRouteBuilder } from "@duplojs/http";

useRouteBuilder("GET", "/users").handler(
	(__, { response }) => response.noContent("users"),
);

useRouteBuilder("POST", "/users").handler(
	(__, { response }) => response.noContent("created"),
);
