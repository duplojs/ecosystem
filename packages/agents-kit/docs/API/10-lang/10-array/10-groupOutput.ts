/**
 * @title DArray.groupOutput
 *
 * Construire le résultat nommé attendu par DArray.group pour associer une valeur à un groupe.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

// Appel classique : le nom du groupe et la valeur sont fournis ensemble.
const result = DArray.groupOutput("numbers", 1);

// La valeur obtenue est { group: "numbers", value: 1 }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DArray.GroupOutputResult<"numbers", number>,
	"strict"
>;

// Appel curifié : le groupe est fixé avant de fournir la valeur.
const piped = DCommon.pipe(
	2,
	DArray.groupOutput("numbers"),
);

// La valeur obtenue est { group: "numbers", value: 2 }.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	DArray.GroupOutputResult<"numbers", 2>,
	"strict"
>;
