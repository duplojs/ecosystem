/**
 * @title createTemplate
 *
 * Configurer un composant Vue comme template de formulaire.
 */
import { createForm, createTemplate, useMultiLayout } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import { GridInputTemplate } from "@duplojs/form/vueGrid";
import { grid } from "../fixtures/templates";

// La fabrique fixe le composant et les props par défaut hors props système.
const useCompactInputTemplate = createTemplate(
	"input",
	GridInputTemplate,
	{ props: { columns: 6 } },
);

// Le template global utilise six colonnes pour les inputs de ce formulaire.
const useForm = createForm({
	...grid.useTemplates(),
	input: useCompactInputTemplate(),
});

const { component: ArticleForm, dispose } = useForm(
	useMultiLayout({
		title: useTextInput({ label: "Title" }),
		summary: useTextInput({
			label: "Summary",
			// Cette instance surcharge les colonnes pour ce champ uniquement.
			template: useCompactInputTemplate({ columns: 12 }),
		}),
	}),
);

void ArticleForm;
dispose();
