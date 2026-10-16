/**
 * @title DCommon.stringToMillisecond
 *
 * Additionner des durées écrites avec une unité ou exprimées en millisecondes.
 */
import * as DCommon from "@duplojs/lang/common";

const fromStrings = DCommon.stringToMillisecond("1h", "30m", "2s", "500ms");
const fromNumber = DCommon.stringToMillisecond(2_500);

// Les unités acceptées sont `ms`, `s`, `m`, `h`, `d` et `w`.
// Le premier paramètre est obligatoire ; les suivants sont additionnés au résultat.
type _CheckStrings = DCommon.ExpectType<typeof fromStrings, number, "strict">;
type _CheckNumber = DCommon.ExpectType<typeof fromNumber, number, "strict">;

// Les valeurs décimales sont converties puis arrondies à l’entier inférieur.
// Une chaîne invalide lève InvalidMillisecondInStringError à l’exécution.
