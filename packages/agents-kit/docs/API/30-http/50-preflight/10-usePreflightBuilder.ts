/**
 * @title usePreflightBuilder
 *
 * Préparer des traitements et configurations communs à plusieurs routes.
 */
import { IgnoreByRouteStoreMetadata, usePreflightBuilder } from "@duplojs/http";

const preflight = usePreflightBuilder({
	hooks: [
		{
			beforeRouteExecution({ next }) {
				return next();
			},
		},
	],
	metadata: [IgnoreByRouteStoreMetadata()],
});

// Un preflight prépare un builder pour plusieurs routes : il ne crée pas
// lui-même de route. Ajouter des process avec exec, puis créer les routes
// avec useRouteBuilder.
//
// hooks associe des hooks de cycle de vie aux routes préparées. metadata
// associe des metadata à leurs définitions, pas au floor. Ici, chaque route
// finalisée est exclue du routeStore global, mais peut être enregistrée
// explicitement.
// Sans options, les deux tableaux sont vides.
