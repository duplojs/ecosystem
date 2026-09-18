import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";
import * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";

interface User {
	readonly id: number;
	readonly name: string;
	readonly age: number;
	readonly friends?: readonly User[];
	readonly createdAt?: DChrono.TheDate;
}

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
		ResponseContract.ok("users.findMany", DDataStructure.array(user)),
		(floor, { response }) => response("users.findMany", [
			{
				id: 23,
				name: "",
				age: 28,
			},
		]),
	);

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.number(),
		},
	})
	.handler(
		ResponseContract.ok("users.find", user),
		(floor, { response }) => response("users.find", {
			id: floor.userId,
			name: "",
			age: 28,
		}),
	);

useRouteBuilder("POST", "/users")
	.extract({
		body: user,
	})
	.handler(
		ResponseContract.ok("users.create", user),
		(floor, { response }) => response("users.create", floor.body),
	);

useRouteBuilder("DELETE", "/users")
	.extract({
		body: {
			id: DDataStructure.number(),
		},
	})
	.handler(
		ResponseContract.noContent("users.deleted"),
		(__, { response }) => response("users.deleted"),
	);
