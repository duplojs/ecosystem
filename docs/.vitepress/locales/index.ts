import type { DefaultTheme, UserConfig } from "vitepress";
import { fr } from "./fr";

export const locales = {
	fr: fr,
} satisfies UserConfig<DefaultTheme.Config>["locales"];
