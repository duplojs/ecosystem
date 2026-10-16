/**
 * @title DEither.rightAsyncPipe
 *
 * Enchaîner des transformations asynchrones sur la valeur d’un Right en arrêtant au premier Left.
 */
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import type * as DCommon from "@duplojs/lang/common";

// Une entrée brute peut être suivie d’une étape synchrone ; la sortie reste
// toujours enveloppée dans une Promise de Success.
const fromPlain = DEither.rightAsyncPipe(
	Promise.resolve("saved"),
	DString.toUpperCase,
);
type _CheckFromPlain = DCommon.ExpectType<
	typeof fromPlain,
	Promise<DEither.Success<Uppercase<string>>>,
	"strict"
>;

// Chaque étape reçoit la valeur déballée du Right, même lorsqu’une étape
// asynchrone retourne elle-même un Right.
const fromIntermediateRight = DEither.rightAsyncPipe(
	Promise.resolve(DEither.success("saved")),
	(value) => Promise.resolve(DEither.right("normalized", value)),
	DString.toUpperCase,
);
type _CheckFromIntermediateRight = DCommon.ExpectType<
	typeof fromIntermediateRight,
	Promise<DEither.Success<"SAVED">>,
	"strict"
>;

// Si la dernière étape retourne un Right, ce wrapper est conservé tel quel.
const finalRight = DEither.rightAsyncPipe(
	Promise.resolve(DEither.success("saved")),
	(value) => Promise.resolve(DEither.right("normalized", value)),
);
type _CheckFinalRight = DCommon.ExpectType<
	typeof finalRight,
	Promise<DEither.Right<"normalized", "saved">>,
	"strict"
>;

declare const input: Promise<DEither.Success<"saved"> | DEither.Error<"missing">>;

// Un Left initial est propagé et les étapes suivantes ne sont pas exécutées.
const propagated = DEither.rightAsyncPipe(
	input,
	DString.toUpperCase,
);
type _CheckPropagated = DCommon.ExpectType<
	typeof propagated,
	Promise<DEither.Error<"missing"> | DEither.Success<"SAVED">>,
	"strict"
>;

// Un Left produit par une étape arrête aussi les étapes suivantes.
const stopped = DEither.rightAsyncPipe(
	Promise.resolve(DEither.success("saved")),
	() => Promise.resolve(DEither.error("not-found")),
	() => Promise.resolve("never-reached" as const),
);
type _CheckStopped = DCommon.ExpectType<
	typeof stopped,
	Promise<DEither.Error<"not-found"> | DEither.Success<"never-reached">>,
	"strict"
>;
