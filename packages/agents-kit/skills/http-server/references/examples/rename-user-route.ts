/**
 * @title Adapter les résultats d'un scénario applicatif.
 *
 * Un preset résout la ressource ; un cut traite l'issue propre à la modification.
 */
import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import { renameUserBody, userStructure, type RenameUserBody, type User } from "./contracts";
import { iWantUserExist } from "./user-checker";

// Use case résolu dans l'infrastructure ; il porte la règle de modification.
declare function renameUser(user: User, body: RenameUserBody): Promise<
	DEither.Right<"user-renamed", User> | DEither.Left<"rename-denied", undefined>
>;

export const renameUserRoute = useRouteBuilder("PATCH", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
		// Une structure sur la source conserve floor.body.
		body: renameUserBody,
	})
	.presetCheck(iWantUserExist.indexing("user"), ({ userId }) => userId)
	.cut(
		ResponseContract.conflict("user.renameDenied"),
		async({ user, body }, { response, output }) => {
			const result = await renameUser(user, body);

			return DEither.matchInformation(result, {
				"user-renamed": (updatedUser) => output({ updatedUser }),
				"rename-denied": () => response("user.renameDenied"),
			});
		},
	)
	.handler(
		ResponseContract.ok("user.renamed", userStructure),
		(floor, { response }) => {
			type _CheckFloor = DCommon.ExpectType<
				typeof floor,
				{
					userId: User["id"];
					body: RenameUserBody;
					user: User;
					updatedUser: User;
				},
				"strict"
			>;

			return response("user.renamed", floor.updatedUser);
		},
	);
