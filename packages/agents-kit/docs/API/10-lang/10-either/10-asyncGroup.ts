/**
 * @title DEither.asyncGroup
 *
 * Regrouper séquentiellement des résultats synchrones ou asynchrones dans un Success.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const objectResult = DEither.asyncGroup({
	user: () => Promise.resolve(DEither.success("Alice")),
	count: DEither.success(2),
});

// La sortie attend chaque entrée et regroupe les valeurs déballées dans une Promise.
type _CheckObject = DCommon.ExpectType<
	typeof objectResult,
	Promise<DEither.Success<{
		user: "Alice";
		count: 2;
	}>>,
	"strict"
>;

// Le premier Left est retourné et les getters placés après lui ne sont pas exécutés.
const errorResult = DEither.asyncGroup({
	user: () => Promise.resolve(DEither.success("Alice")),
	error: () => Promise.resolve(DEither.error("user-not-found")),
	skipped: () => Promise.resolve(DEither.success(2)),
});
type _CheckError = DCommon.ExpectType<
	typeof errorResult,
	Promise<DEither.Error<"user-not-found"> | DEither.Success<{
		user: "Alice";
		error: never;
		skipped: 2;
	}>>,
	"strict"
>;

const tupleResult = DEither.asyncGroup([
	() => Promise.resolve(DEither.success("Alice")),
	() => Promise.resolve(DEither.success(2)),
] as const);
type _CheckTuple = DCommon.ExpectType<typeof tupleResult, Promise<DEither.Success<["Alice", 2]>>, "strict">;
