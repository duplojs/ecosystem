/**
 * @title DObject.isSimple
 *
 * Vérifier si un objet est simple sans affiner son type.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

// La fonction reçoit un objet déjà identifié et indique s’il est simple.
declare const input: { name: string } | Date;
const result = DObject.isSimple(input);

type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Le booléen ne réduit le type d’entrée dans aucune des deux branches.
if (DObject.isSimple(input)) {
	type _CheckInput = DCommon.ExpectType<typeof input, { name: string } | Date, "strict">;
} else {
	// Une instance de Date reste un objet même si elle n’est pas simple.
	type _CheckInput = DCommon.ExpectType<typeof input, { name: string } | Date, "strict">;
}

// Depuis unknown, DObject.is identifie l’objet avant de vérifier s’il est simple.
declare const externalInput: unknown;
if (DObject.is(externalInput) && DObject.isSimple(externalInput)) {
	const count = DObject.countKeys(externalInput);

	type _CheckInput = DCommon.ExpectType<typeof externalInput, object, "strict">;
	type _CheckCount = DCommon.ExpectType<typeof count, number, "strict">;
}

// La fonction unaire peut servir d’étape produisant un booléen dans un pipe.
const isSimple = DCommon.pipe(
	input,
	DObject.isSimple,
);
// Le résultat indique si l’objet fourni est simple.
type _CheckIsSimple = DCommon.ExpectType<typeof isSimple, boolean, "strict">;
