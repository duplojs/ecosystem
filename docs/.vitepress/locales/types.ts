import type { DefaultTheme, UserConfig } from "vitepress";

type LocalesConfig = NonNullable<UserConfig<DefaultTheme.Config>["locales"]>;

export type LocaleConfig = LocalesConfig[string];

export type ThemeConfig = NonNullable<LocaleConfig["themeConfig"]>;
