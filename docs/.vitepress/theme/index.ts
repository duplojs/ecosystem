import DefaultTheme from "vitepress/theme";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import type { Theme } from "vitepress";
import VersionSwitcher from "./components/VersionSwitcher.vue";
import "@shikijs/vitepress-twoslash/style.css";
import "virtual:group-icons.css";
import "./style.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("VersionSwitcher", VersionSwitcher);
		app.use(TwoslashFloatingVue);
	},
} satisfies Theme;
