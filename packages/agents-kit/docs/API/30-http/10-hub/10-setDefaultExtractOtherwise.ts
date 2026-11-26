/**
 * @title Hub.setDefaultExtractOtherwise
 *
 * Configurer la réponse par défaut lorsqu'une extraction échoue.
 */
import { createHub } from "@duplojs/http";

// Appelé si la lecture du body ou la validation d'une extraction échoue.
// La callback synchrone reçoit response, floor et dataStructureError (erreur
// de validation ou de lecture). Par défaut : 422 / extract-error avec l'erreur.
const hub = createHub({ environment: "DEV" })
	.setDefaultExtractOtherwise(({ response, dataStructureError }) => response.unprocessableContent(
		"extract-error",
		dataStructureError,
	));

// Le contrat par défaut impose cette réponse 422 / extract-error avec une Error ;
// OverrideDefaultOtherwiseExtractResponse permet de modifier le contrat global
// par augmentation de module si la réponse change. Une callback otherwise locale
// à extract remplace ce défaut pour cette étape. L'échec arrête le flux et ajoute
// l'en-tête extract-key identifiant la source.
