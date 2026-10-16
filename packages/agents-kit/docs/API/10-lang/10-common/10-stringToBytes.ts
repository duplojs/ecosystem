/**
 * @title DCommon.stringToBytes
 *
 * Convertir une quantité en octets écrite avec une unité ou déjà numérique.
 */
import * as DCommon from "@duplojs/lang/common";

const fromString = DCommon.stringToBytes("1.5kb");
const fromNumber = DCommon.stringToBytes(512);

// Les unités acceptées sont `b`, `kb`, `mb`, `gb`, `tb` et `pb`.
// Les valeurs décimales sont converties en octets puis arrondies à l’entier inférieur.
type _CheckString = DCommon.ExpectType<typeof fromString, number, "strict">;
type _CheckNumber = DCommon.ExpectType<typeof fromNumber, number, "strict">;

// Une chaîne qui ne respecte pas le format lève InvalidBytesInStringError à l’exécution.
