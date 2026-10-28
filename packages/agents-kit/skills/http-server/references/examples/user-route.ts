/**
 * @title Valider une entrée puis interpréter un checker dans une route.
 *
 * L'extraction et l'indexation du résultat enrichissent le floor du handler.
 */
import { useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";
import { type User } from "./contracts";
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
		otherwise: ({ response, result }) => {
			type _CheckRejectedResult = DCommon.ExpectType<
				typeof result.information,
				"user.notFound",
				"strict"
			>;

			return response.notFound("user.notFound");
		},
		indexing: "user",
	})
	.handler(
		(floor, { response }) => {
			type _CheckFloor = DCommon.ExpectType<
				typeof floor,
				{
					userId: User["id"];
					user: User;
				},
				"strict"
			>;

			return response.ok("user.read", floor.user);
		},
	);
