/**
 * @title Assertions.toHaveText
 *
 * Vérifier le texte complet d’un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

await Assertions.toHaveText(articleList, "title", "Introduction à TypeScript");
