/**
 * @title DEither.asyncSafeCallback
 *
 * Convertir une callback ou une promesse et ses exceptions en résultat asynchrone.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare const saved: "saved";
const result = DEither.asyncSafeCallback(() => Promise.resolve(saved));

// La sortie est toujours une Promise et inclut le Left standard des erreurs capturées.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<DEither.SafeCallbackSuccess<"saved"> | DEither.SafeCallbackError>,
	"strict"
>;

const savedPromise = Promise.resolve(saved);
const promiseInput = DEither.asyncSafeCallback(savedPromise);
type _CheckPromiseInput = DCommon.ExpectType<
	typeof promiseInput,
	Promise<DEither.SafeCallbackSuccess<"saved"> | DEither.SafeCallbackError>,
	"strict"
>;
