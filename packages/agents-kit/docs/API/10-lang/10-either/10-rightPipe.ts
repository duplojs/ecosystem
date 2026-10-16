/**
 * @title DEither.rightPipe
 *
 * Enchaîner des transformations sur la valeur d’un Right en arrêtant au premier Left.
 */
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import type * as DCommon from "@duplojs/lang/common";

// Une entrée brute est transmise telle quelle à la première étape et sa sortie
// brute est enveloppée dans un Success.
const fromPlain = DEither.rightPipe(
	"saved",
	DString.toUpperCase,
);
type _CheckFromPlain = DCommon.ExpectType<typeof fromPlain, DEither.Success<"SAVED">, "strict">;

// Une étape reçoit la valeur déballée du Right, jamais son wrapper.
const fromRight = DEither.rightPipe(
	DEither.success("saved"),
	DString.toUpperCase,
);
type _CheckFromRight = DCommon.ExpectType<typeof fromRight, DEither.Success<"SAVED">, "strict">;

// Un Right intermédiaire est déballé avant l’étape suivante ; seule la valeur
// de la dernière étape détermine la sortie finale.
const fromIntermediateRight = DEither.rightPipe(
	DEither.success("saved"),
	(value) => DEither.right("normalized", value),
	DString.toUpperCase,
);
type _CheckFromIntermediateRight = DCommon.ExpectType<
	typeof fromIntermediateRight,
	DEither.Success<"SAVED">,
	"strict"
>;

// Si la dernière étape retourne un Right, ce wrapper est conservé tel quel.
const finalRight = DEither.rightPipe(
	DEither.success("saved"),
	(value) => DEither.right("normalized", value),
);
type _CheckFinalRight = DCommon.ExpectType<
	typeof finalRight,
	DEither.Right<"normalized", "saved">,
	"strict"
>;

declare const input: DEither.Success<"saved"> | DEither.Error<"missing">;

// Un Left initial est propagé sans exécuter les étapes prévues pour les Right.
const propagated = DEither.rightPipe(
	input,
	DString.toUpperCase,
);
type _CheckPropagated = DCommon.ExpectType<
	typeof propagated,
	DEither.Error<"missing"> | DEither.Success<"SAVED">,
	"strict"
>;

// Un Left produit par une étape arrête aussi les étapes suivantes.
const stopped = DEither.rightPipe(
	DEither.success("saved"),
	() => DEither.error("not-found"),
	() => "never-reached" as const,
);
type _CheckStopped = DCommon.ExpectType<
	typeof stopped,
	DEither.Error<"not-found"> | DEither.Success<"never-reached">,
	"strict"
>;
