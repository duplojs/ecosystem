import { useRouteBuilder } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { type User } from "@routes/types";

const user: DDataStructure.Structure<User> = DDataStructure.object({
	id: DDataStructure.number().setIdentifier("UserId"),
	name: DDataStructure.string().setIdentifier("UserName"),
	age: DDataStructure.number(),
	friends: DCommon.pipe(
		DDataStructure.lazy(() => user),
		DDataStructure.array,
		DDataStructure.optional,
	),
	createdAt: DDataStructure.optional(DDataStructure.date()),
}).contract<User>().setIdentifier("User");

useRouteBuilder("GET", "/users", {
	hooks: [
		createCacheControllerHooks({
			private: ["authorization", "cookie"],
			noCache: ["set-cookie"],
			maxAge: 200,
		}),
	],
})
	.handler(
		(floor, { response }) => response.ok("users.findMany", DCommon.forward<readonly User[]>([
			{
				id: 23,
				name: "",
				age: 28,
			},
		])),
	);

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.number(),
		},
	})
	.handler(
		(floor, { response }) => response.ok("users.find", DCommon.forward<User>({
			id: floor.userId,
			name: "",
			age: 28,
		})),
	);

useRouteBuilder("POST", "/users")
	.extract({
		body: user,
	})
	.handler(
		(floor, { response }) => response.ok("users.create", floor.body),
	);

useRouteBuilder("DELETE", "/users")
	.extract({
		body: {
			id: DDataStructure.number(),
		},
	})
	.handler(
		(__, { response }) => response.noContent("users.deleted"),
	);
