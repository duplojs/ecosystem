/**
 * @title DCommon.print
 *
 * Afficher une valeur et la retourner inchangée.
 */
import * as DCommon from "@duplojs/lang/common";

// Affichage standard : le niveau par défaut est info.
const message = DCommon.print("Traitement terminé");
type _CheckMessage = DCommon.ExpectType<
	typeof message,
	"Traitement terminé",
	"strict"
>;

// Niveaux explicites : info, warn et error choisissent le niveau de sortie.
const warning = DCommon.print("Attention", "warn");
type _CheckWarning = DCommon.ExpectType<
	typeof warning,
	"Attention",
	"strict"
>;

// Affichage tabulaire : seules les colonnes indiquées sont affichées.
declare const users: {
	name: string;
	age: number;
}[];
const table = DCommon.print(users, { columns: ["name"] });
// La valeur retournée reste le tableau complet, avec la même référence.
type _CheckTable = DCommon.ExpectType<
	typeof table,
	{
		name: string;
		age: number;
	}[],
	"strict"
>;

// Inspection d'un objet : depth limite la profondeur d'affichage ; null la laisse illimitée.
declare const data: { user: { name: string } };
const inspected = DCommon.print(data, { depth: 2 });
type _CheckInspected = DCommon.ExpectType<
	typeof inspected,
	{ user: { name: string } },
	"strict"
>;

// Dans un pipe, print peut observer une valeur sans interrompre sa transmission.
const piped = DCommon.pipe(
	"prêt",
	DCommon.print,
);
// Le résultat transmis reste "prêt".
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	"prêt",
	"strict"
>;
