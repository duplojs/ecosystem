import { ResponseContract, useRouteBuilder } from "@duplojs/http";

useRouteBuilder("GET", "/users").handler(
	ResponseContract.noContent("users"),
	(__, { response }) => response("users"),
);

useRouteBuilder("POST", "/users").handler(
	ResponseContract.noContent("created"),
	(__, { response }) => response("created"),
);
