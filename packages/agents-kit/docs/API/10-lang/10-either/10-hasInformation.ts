/**
 * @title DEither.hasInformation
 *
 * Tester l’information d’un Either et affiner le statut et la valeur.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;

// La forme curifiée est directement utilisable comme predicate de DCommon.when.
const result = DCommon.pipe(
	input,
	DCommon.when(
		DEither.hasInformation("missing"),
		DEither.unwrapLeft,
	),
);

// Le cas ciblé devient Error ; le cas non ciblé conserve son Right.
type _CheckResult = DCommon.ExpectType<typeof result, Error | DEither.Success<"saved">, "strict">;

const matches = DEither.hasInformation(DEither.success("saved"), "success");
type _CheckMatches = DCommon.ExpectType<typeof matches, boolean, "strict">;
