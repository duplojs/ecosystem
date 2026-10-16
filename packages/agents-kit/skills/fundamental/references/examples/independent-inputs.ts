/**
 * @title Combiner des sources indépendantes.
 *
 * Préparer les arguments séparément avant leur combinaison.
 */
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

declare const users: readonly {
	enabled: boolean;
	name: string;
}[];
declare const rawSearch: string;
declare function searchUsers(names: readonly string[], search: string): readonly string[];

const names = DArray.map(users, (user) => user.name);
const search = DString.trim(rawSearch);
const matches = searchUsers(names, search);
