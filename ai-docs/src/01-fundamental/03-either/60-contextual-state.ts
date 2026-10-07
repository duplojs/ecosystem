/**
 * @title États contextualisés avec Result.
 *
 * Décrire et discriminer des états sans leur attribuer un sens de succès ou d’échec.
 */
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";

// Result<Information, Value> étend Right et porte un marqueur Result supplémentaire.
// Il exprime un constat : l’appelant décide du sens de cet état dans son contexte.
// Une fonction peut ainsi renvoyer uniquement des Result, sans branche Left.
type EmailState = (
	| DEither.Result<"valid-email", string & DString.Email>
	| DEither.Result<"invalid-email", string>
);

// Le format est vérifié, mais la fonction ne décide pas si l’état observé est un échec.
// Un format invalide peut être précisément l’état recherché lors d’un nettoyage de données.
function classifyEmail(input: string): EmailState {
	if (DString.isEmail(input)) {
		return DEither.result("valid-email", input);
	}

	return DEither.result("invalid-email", input);
}

declare const input: string;
const state = classifyEmail(input);

// Les deux variantes sont Right : isRight ne permet pas de distinguer ces états.
// La discrimination repose sur l’information et affine aussi le type de la valeur.
if (DEither.hasInformation(state, "valid-email")) {
	const email: string & DString.Email = DEither.unwrapRight(state);
}

// Les outils Either restent disponibles, notamment pour traiter chaque état explicitement.
const description = DEither.matchInformation(state, {
	"valid-email": (email) => `Format reconnu : ${email}`,
	"invalid-email": (value) => `Format à corriger : ${value}`,
});
