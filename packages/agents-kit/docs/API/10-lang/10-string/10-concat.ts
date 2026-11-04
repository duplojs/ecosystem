/**
 * @title DString.concat
 *
 * Ajouter une ou plusieurs chaînes à la fin d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.concat("hello", " ", "world");
// La valeur obtenue est "hello world".
type _CheckResult = DCommon.ExpectType<typeof result, "hello world", "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.concat(" "),
);
// La forme curifiée fixe l'élément ajouté dans l'étape du pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, "hello ", "strict">;
