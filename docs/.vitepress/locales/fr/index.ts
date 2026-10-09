import type { LocaleConfig } from "../types";
import { frV1ThemeConfig } from "./v1";
import { apiNavLink, guideNavLink } from "../../navigation/navLinks";

export const fr = {
	label: "Francais",
	lang: "fr-FR",
	link: "/fr/",
	title: "DuploJS",
	description: "Documentation de l'ecosysteme DuploJS.",
	themeConfig: {
		...frV1ThemeConfig,
		nav: [
			{
				text: "Accueil",
				link: "/fr/",
			},
			{
				text: "Guide",
				link: guideNavLink,
				activeMatch: "^/fr/v[0-9]+/guide/",
			},
			{
				text: "API",
				link: apiNavLink,
				activeMatch: "^/fr/v[0-9]+/api/",
			},
			{
				component: "VersionSwitcher",
			},
		],
	},
} satisfies LocaleConfig;
