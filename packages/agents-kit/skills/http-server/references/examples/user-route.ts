/**
 * @title Valider une entrée puis interpréter un checker dans une route.
 *
 * L'extraction et l'indexation du résultat enrichissent le floor du handler.
 */
import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";
import { userStructure, type User } from "./contracts";
import { userExist } from "./user-checker";

export const userRoute = useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
	})
	.check(userExist, {
		input: ({ userId }) => userId,
		result: "user.found",
		otherwise: ResponseContract.notFound("user.notFound"),
		indexing: "user",
	})
	.handler(
		ResponseContract.ok("user.read", userStructure),
		(floor, { response }) => {
			type _CheckFloor = DCommon.ExpectType<
				typeof floor,
				{
					userId: User["id"];
					user: User;
				},
				"strict"
			>;

			return response("user.read", floor.user);
		},
	);
