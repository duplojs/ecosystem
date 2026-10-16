/**
 * @title DEither.group
 *
 * Regrouper des Right dans un Success en arrêtant au premier Left.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// La forme objet conserve les clés et déballe les valeurs des Right.
const objectResult = DEither.group({
	user: DEither.success("Alice"),
	count: DEither.success(2),
});
type _CheckObject = DCommon.ExpectType<
	typeof objectResult,
	DEither.Success<{
		user: "Alice";
		count: 2;
	}>,
	"strict"
>;

// Les getters permettent de différer le calcul de chaque résultat.
const withGetters = DEither.group({
	user: () => DEither.success("Alice"),
	count: () => DEither.success(2),
});
type _CheckGetters = DCommon.ExpectType<
	typeof withGetters,
	DEither.Success<{
		user: "Alice";
		count: 2;
	}>,
	"strict"
>;

// Le premier Left est retourné et les getters placés après lui ne sont pas exécutés.
const errorResult = DEither.group({
	user: () => DEither.success("Alice"),
	error: () => DEither.error("user-not-found"),
	skipped: () => DEither.success(2),
});
type _CheckError = DCommon.ExpectType<
	typeof errorResult,
	DEither.Error<"user-not-found"> | DEither.Success<{
		user: "Alice";
		error: never;
		skipped: 2;
	}>,
	"strict"
>;

const tupleResult = DEither.group([
	DEither.success("Alice"),
	DEither.success(2),
] as const);
// La forme tuple conserve sa longueur et déballe chaque Right.
type _CheckTuple = DCommon.ExpectType<typeof tupleResult, DEither.Success<["Alice", 2]>, "strict">;
