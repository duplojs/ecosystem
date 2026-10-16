/**
 * @title Composer une transformation.
 *
 * Appels curifiés dans un pipe multiligne, avec inférence depuis la donnée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

declare const users: readonly {
	enabled: boolean;
	name: string;
}[];

const enabledUsers = DArray.filter(users, (user) => user.enabled);

// Même avec deux arguments, le pipe place la donnée et l'étape sur deux lignes.
// L'appel curifié est écrit ici, dans le contexte fourni par le pipe.
const names = DCommon.pipe(
	users,
	DArray.map((user) => user.name),
);

type _CheckNames = DCommon.ExpectType<typeof names, readonly string[], "strict">;

// Plusieurs transformations s'enchaînent avec leurs appels curifiés à leur place.
const enabledNames = DCommon.pipe(
	users,
	DArray.filter((user) => user.enabled),
	DArray.map((user) => user.name),
);

type _CheckEnabledNames = DCommon.ExpectType<typeof enabledNames, readonly string[], "strict">;

// À éviter : les génériques explicites rendent la préparation typable, mais le
// pipe ajouté ensuite ne déplace pas l'appel de configuration dans son contexte.
const preparedNames = DArray.map<typeof users, string>((user) => user.name);
const namesFromPreparedStep = DCommon.pipe(
	users,
	preparedNames,
);
