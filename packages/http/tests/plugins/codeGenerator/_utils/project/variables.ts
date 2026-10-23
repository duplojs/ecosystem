import { ResponseContract, useRouteBuilder } from "@duplojs/http";

export const usersRoute = useRouteBuilder("GET", "/users").handler(
	ResponseContract.noContent("users"),
	(__, { response }) => response("users"),
);
