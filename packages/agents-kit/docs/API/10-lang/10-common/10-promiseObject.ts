/**
 * @title DCommon.promiseObject
 *
 * Attendre toutes les propriétés promises d’un objet et reconstruire l’objet résolu.
 */
import * as DCommon from "@duplojs/lang/common";

declare const values: {
	name: string;
	count: Promise<number>;
};
const result = DCommon.promiseObject(values);

// Chaque propriété conserve son nom et reçoit sa valeur résolue.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<{
		name: string;
		count: number;
	}>,
	"strict"
>;
