import type { ThemeConfig } from "../types";

export const frV1ThemeConfig = {
	sidebar: {
		"/fr/v1/guide/": [
			{
				text: "Guide",
				items: [
					{
						text: "Introduction",
						link: "/fr/v1/guide/",
					},
				],
			},
		],
	},
	outline: {
		label: "Sur cette page",
	},
	docFooter: {
		prev: "Page precedente",
		next: "Page suivante",
	},
	lastUpdated: {
		text: "Derniere mise a jour",
	},
	search: {
		options: {
			locales: {
				root: {
					translations: {
						button: {
							buttonText: "Rechercher",
							buttonAriaLabel: "Rechercher",
						},
						modal: {
							displayDetails: "Afficher les details",
							resetButtonTitle: "Reinitialiser",
							backButtonTitle: "Fermer",
							noResultsText: "Aucun resultat pour",
							footer: {
								selectText: "selectionner",
								selectKeyAriaLabel: "Entree",
								navigateText: "naviguer",
								navigateUpKeyAriaLabel: "fleche haut",
								navigateDownKeyAriaLabel: "fleche bas",
								closeText: "fermer",
								closeKeyAriaLabel: "Echap",
							},
						},
					},
				},
			},
		},
	},
} satisfies ThemeConfig;
