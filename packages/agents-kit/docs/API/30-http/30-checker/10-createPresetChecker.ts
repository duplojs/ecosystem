/**
 * @title createPresetChecker
 *
 * Créer un preset pour réutiliser la sélection et le refus d'un checker.
 */
import { createPresetChecker, type GetPresetCheckerInput } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import { userChecker } from "./10-useCheckerBuilder";

// Le preset fixe le checker, les informations acceptées et la réponse aux
// autres résultats. otherwise reçoit response et result, sans floor appelant.
export const requireUser = createPresetChecker(
	userChecker,
	{
		result: "user.found",
		otherwise: ({ response, result }) => {
			if (result.information === "user.missing") {
				return response.notFound("user.notFound", result.value.id);
			}

			return response.forbidden("user.inactive", result.value.id);
		},
	},
);

// Chaque méthode retourne un nouveau preset sans modifier le précédent.
// indexing nomme la valeur ajoutée au floor ; options remplace les options
// par défaut du checker, sans fusion.
// rewriteInput adapte l'entrée reçue par le preset vers l'entrée du checker.
export const requireUserFromSession = requireUser
	.indexing("user")
	.rewriteInput((session: { userId: string }) => session.userId)
	.options({ allowInactive: true });

type _PresetInput = DCommon.ExpectType<
	GetPresetCheckerInput<typeof requireUserFromSession>,
	{ userId: string },
	"strict"
>;

// indexing, rewriteInput et options peuvent aussi être fixés à la création.
