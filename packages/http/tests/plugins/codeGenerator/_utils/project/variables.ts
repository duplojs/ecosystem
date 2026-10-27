import { useRouteBuilder } from "@duplojs/http";

export const usersRoute = useRouteBuilder("GET", "/users").handler(
	(__, { response }) => response.noContent("users"),
);
