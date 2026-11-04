/**
 * @title DCommon.tap
 *
 * Exécuter un traitement secondaire tout en conservant la valeur d’entrée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const input = {
	status: "saved",
	revision: 3,
};
declare function recordStatus(status: Uppercase<string>): void;

// Appel classique : enregistrer le statut sans remplacer l’objet d’entrée.
const direct = DCommon.tap(input, (entry) => {
	recordStatus(DString.toUpperCase(entry.status));
});
type _CheckDirect = DCommon.ExpectType<typeof direct, typeof input, "strict">;

declare function persistAudit(entry: typeof input): Promise<void>;

// Appel curifié : attendre l’audit asynchrone puis conserver l’objet dans le pipe.
const piped = DCommon.pipe(
	input,
	DCommon.tap(persistAudit),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, Promise<typeof input>, "strict">;
