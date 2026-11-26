/**
 * @title controlBodyAsEmpty
 *
 * Sélectionner un body vide pour une route.
 */
import { controlBodyAsEmpty, useRouteBuilder } from "@duplojs/http";

const route = useRouteBuilder("GET", "/health", {
	bodyController: controlBodyAsEmpty(),
})
	.handler(
		(__, { response }) => response.noContent("health.ok"),
	);

// Le lecteur vide par défaut fournit undefined à l'extraction du body ; il ne
// valide pas les données transmises. L'option locale remplace le contrôleur
// par défaut du Hub.
