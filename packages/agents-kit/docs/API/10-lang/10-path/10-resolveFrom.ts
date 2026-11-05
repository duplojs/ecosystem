/**
 * @title DPath.resolveFrom
 *
 * Résoudre des segments depuis une origine absolue, avec une option pour la conserver.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const origin = DPath.declareAbsolutePath("/workspace");
const result = DPath.resolveFrom(
	origin,
	[DPath.declarePath("src"), DPath.declarePath("index.ts")],
	{ stayInOrigin: true },
);
// La valeur obtenue est /workspace/src/index.ts. Une résolution qui sort de l’origine vaut null.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Path & DPath.Absolute) | null, "strict">;

// Option runtime : dès que stayInOrigin peut valoir true, le type inclut null.
declare const stayInOrigin: boolean;
const configured = DPath.resolveFrom(origin, [DPath.declarePath("../shared")], { stayInOrigin });
// La valeur obtenue est null si le confinement est activé, sinon /shared.
type _CheckConfigured = DCommon.ExpectType<typeof configured, (string & DPath.Path & DPath.Absolute) | null, "strict">;

// Sans confinement, .. peut remonter au-dessus de l’origine ; le résultat reste absolu.
const outside = DPath.resolveFrom(origin, [DPath.declarePath("../shared")]);
// La valeur obtenue est /shared ; sans stayInOrigin, null ne fait pas partie du type.
type _CheckOutside = DCommon.ExpectType<typeof outside, string & DPath.Path & DPath.Absolute, "strict">;

// Confinement : refuser une remontée hors de l’origine.
const rejected = DPath.resolveFrom(origin, [DPath.declarePath("../shared")], { stayInOrigin: true });
// La valeur obtenue est null.
type _CheckRejected = DCommon.ExpectType<typeof rejected, (string & DPath.Path & DPath.Absolute) | null, "strict">;

// Une entrée absolue remplace l’origine sans confinement.
const replacement = DPath.resolveFrom(origin, [DPath.declareAbsolutePath("/shared")]);
// La valeur obtenue est /shared. Avec stayInOrigin: true, une entrée absolue est refusée.
type _CheckReplacement = DCommon.ExpectType<typeof replacement, string & DPath.Path & DPath.Absolute, "strict">;
