/**
 * @title Composer une transformation.
 *
 * Formes directe et curifiée sur une même donnée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

declare const users: readonly {
	enabled: boolean;
	name: string;
}[];

const enabledUsers = DArray.filter(users, (user) => user.enabled);

const enabledNames = DCommon.pipe(
	users,
	DArray.filter((user) => user.enabled),
	DArray.map((user) => user.name),
);
